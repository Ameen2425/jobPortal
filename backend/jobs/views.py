from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Job, SavedJob
from .serializers import JobSerializer, SavedJobSerializer
from common.permissions import IsRecruiter
from common.pagination import StandardResultsSetPagination

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search']:
            return [permissions.AllowAny()]
        return [IsRecruiter()]

    def get_queryset(self):
        queryset = Job.objects.select_related('company', 'recruiter').all()
        
        # If user is recruiter and listing own jobs
        if self.action == 'my_jobs' and self.request.user.is_authenticated:
            return queryset.filter(recruiter=self.request.user)

        # For public listing, only show published jobs by default unless admin
        if not (self.request.user.is_authenticated and (self.request.user.role == 'RECRUITER' or self.request.user.is_staff)):
            queryset = queryset.filter(status='PUBLISHED')

        # Filters
        query = self.request.query_params.get('query') or self.request.query_params.get('search')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(skills__icontains=query) |
                Q(company__company_name__icontains=query) |
                Q(location__icontains=query)
            )

        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)

        work_mode = self.request.query_params.get('work_mode')
        if work_mode:
            queryset = queryset.filter(work_mode=work_mode)

        experience_level = self.request.query_params.get('experience_level')
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)

        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        skills = self.request.query_params.get('skills')
        if skills:
            skill_list = [s.strip() for s in skills.split(',')]
            for s in skill_list:
                queryset = queryset.filter(skills__icontains=s)

        min_salary = self.request.query_params.get('min_salary')
        if min_salary:
            queryset = queryset.filter(salary_max__gte=min_salary)

        ordering = self.request.query_params.get('ordering', '-created_at')
        if ordering == 'salary_high':
            queryset = queryset.order_by('-salary_max')
        elif ordering == 'salary_low':
            queryset = queryset.order_by('salary_min')
        elif ordering == 'newest':
            queryset = queryset.order_by('-created_at')
        else:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        # Associate with user's company
        company = getattr(self.request.user, 'companies', None)
        company_obj = self.request.user.companies.first() if company else None
        if not company_obj:
            from companies.models import Company
            company_obj, _ = Company.objects.get_or_create(
                recruiter=self.request.user,
                defaults={'company_name': f"{self.request.user.first_name or self.request.user.username}'s Company"}
            )
        serializer.save(recruiter=self.request.user, company=company_obj)

    @action(detail=False, methods=['get'], permission_classes=[IsRecruiter])
    def my_jobs(self, request):
        jobs = Job.objects.filter(recruiter=request.user)
        page = self.paginate_queryset(jobs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)


class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related('job', 'job__company')

    def create(self, request, *args, **kwargs):
        job_id = request.data.get('job') or request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        job = Job.objects.filter(id=job_id).first()
        if not job:
            return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

        saved_job, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            saved_job.delete()
            return Response({'message': 'Job removed from saved jobs.', 'saved': False})
        
        return Response({'message': 'Job saved successfully.', 'saved': True, 'data': SavedJobSerializer(saved_job).data}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        return self.create(request)
