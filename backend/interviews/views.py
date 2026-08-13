from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Interview
from .serializers import InterviewSerializer
from applications.models import Application
from notifications.models import Notification
from common.permissions import IsRecruiter

class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'RECRUITER':
            return Interview.objects.filter(scheduled_by=user).select_related('application', 'application__job', 'application__candidate')
        elif user.role == 'JOB_SEEKER':
            return Interview.objects.filter(application__candidate=user).select_related('application', 'application__job', 'application__job__company')
        elif user.is_staff or user.role == 'ADMIN':
            return Interview.objects.all()
        return Interview.objects.none()

    def perform_create(self, serializer):
        interview = serializer.save(scheduled_by=self.request.user)
        # Automatically update application status to INTERVIEW
        application = interview.application
        application.status = Application.Status.INTERVIEW
        application.save()

        # Notify Candidate
        Notification.objects.create(
            user=application.candidate,
            title="Interview Scheduled!",
            message=f"An interview for {application.job.title} at {application.job.company.company_name} has been scheduled on {interview.interview_date} at {interview.interview_time}.",
            notification_type="INTERVIEW_SCHEDULED",
            link="/job-seeker/applications"
        )
