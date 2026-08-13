from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job
from notifications.models import Notification
from common.permissions import IsJobSeeker, IsRecruiter
from common.pagination import StandardResultsSetPagination

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action in ['create', 'my_applications']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Application.objects.none()

        if user.role == 'JOB_SEEKER':
            return Application.objects.filter(candidate=user).select_related('job', 'job__company')
        elif user.role == 'RECRUITER':
            return Application.objects.filter(job__recruiter=user).select_related('job', 'candidate', 'candidate__job_seeker_profile')
        elif user.is_staff or user.role == 'ADMIN':
            return Application.objects.all().select_related('job', 'candidate')
        return Application.objects.none()

    def perform_create(self, serializer):
        application = serializer.save(candidate=self.request.user)
        # Notify recruiter
        Notification.objects.create(
            user=application.job.recruiter,
            title="New Job Application Received",
            message=f"{self.request.user.get_full_name() or self.request.user.username} applied for {application.job.title}",
            notification_type="APPLICATION_SUBMITTED",
            link=f"/recruiter/jobs/{application.job.id}/applicants"
        )
        # Notify candidate confirmation
        Notification.objects.create(
            user=self.request.user,
            title="Application Submitted Successfully",
            message=f"Your application for {application.job.title} at {application.job.company.company_name} was received.",
            notification_type="APPLICATION_SUBMITTED",
            link="/job-seeker/applications"
        )

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        applications = Application.objects.filter(candidate=request.user).select_related('job', 'job__company')
        page = self.paginate_queryset(applications)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch', 'put'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        if not new_status or new_status not in Application.Status.values:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = new_status
        application.save()

        # Send notification to candidate
        status_messages = {
            Application.Status.UNDER_REVIEW: "Your application is currently under review.",
            Application.Status.SHORTLISTED: "Congratulations! Your application has been shortlisted.",
            Application.Status.INTERVIEW: "An interview has been requested for your application.",
            Application.Status.SELECTED: "Congratulations! You have been selected for the position.",
            Application.Status.REJECTED: "Thank you for applying. Unfortunately, your application was not selected."
        }

        Notification.objects.create(
            user=application.candidate,
            title=f"Application Status Updated: {new_status}",
            message=status_messages.get(new_status, f"Status updated to {new_status} for {application.job.title}"),
            notification_type="STATUS_CHANGE",
            link="/job-seeker/applications"
        )

        return Response(ApplicationSerializer(application, context={'request': request}).data)
