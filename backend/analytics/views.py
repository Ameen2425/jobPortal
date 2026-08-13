from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

from jobs.models import Job, SavedJob
from applications.models import Application
from companies.models import Company
from interviews.models import Interview
from accounts.models import JobSeekerProfile

User = get_user_model()

class JobSeekerAnalyticsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        applications = Application.objects.filter(candidate=user)
        saved_jobs = SavedJob.objects.filter(user=user).count()
        profile = getattr(user, 'job_seeker_profile', None)

        total_applications = applications.count()
        shortlisted = applications.filter(status='SHORTLISTED').count()
        interviews = applications.filter(status='INTERVIEW').count()
        selected = applications.filter(status='SELECTED').count()
        rejected = applications.filter(status='REJECTED').count()

        status_breakdown = [
            {'status': 'Applied', 'count': applications.filter(status='APPLIED').count()},
            {'status': 'Under Review', 'count': applications.filter(status='UNDER_REVIEW').count()},
            {'status': 'Shortlisted', 'count': shortlisted},
            {'status': 'Interview', 'count': interviews},
            {'status': 'Selected', 'count': selected},
            {'status': 'Rejected', 'count': rejected},
        ]

        return Response({
            'total_applications': total_applications,
            'shortlisted': shortlisted,
            'interviews': interviews,
            'selected': selected,
            'saved_jobs': saved_jobs,
            'profile_completion': profile.profile_completion if profile else 20,
            'status_breakdown': status_breakdown
        })


class RecruiterAnalyticsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        jobs = Job.objects.filter(recruiter=user)
        applications = Application.objects.filter(job__recruiter=user)
        interviews = Interview.objects.filter(scheduled_by=user)

        total_jobs = jobs.count()
        active_jobs = jobs.filter(status='PUBLISHED').count()
        total_applicants = applications.count()
        shortlisted = applications.filter(status='SHORTLISTED').count()
        interviews_count = interviews.count()
        selected = applications.filter(status='SELECTED').count()

        # Job performance
        job_performance = []
        for job in jobs[:5]:
            job_performance.append({
                'title': job.title,
                'applicants': job.applications.count(),
                'status': job.status
            })

        funnel = [
            {'stage': 'Total Applicants', 'count': total_applicants},
            {'stage': 'Shortlisted', 'count': shortlisted},
            {'stage': 'Interviews', 'count': interviews_count},
            {'stage': 'Selected', 'count': selected},
        ]

        return Response({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_applicants': total_applicants,
            'shortlisted': shortlisted,
            'interviews': interviews_count,
            'selected': selected,
            'job_performance': job_performance,
            'funnel': funnel
        })


class AdminAnalyticsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if not (request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Unauthorized access.'}, status=status.HTTP_403_FORBIDDEN)

        total_users = User.objects.count()
        job_seekers = User.objects.filter(role='JOB_SEEKER').count()
        recruiters = User.objects.filter(role='RECRUITER').count()
        companies = Company.objects.count()
        jobs = Job.objects.count()
        active_jobs = Job.objects.filter(status='PUBLISHED').count()
        applications = Application.objects.count()
        interviews = Interview.objects.count()

        user_growth = [
            {'name': 'Job Seekers', 'value': job_seekers},
            {'name': 'Recruiters', 'value': recruiters},
            {'name': 'Companies', 'value': companies},
        ]

        return Response({
            'total_users': total_users,
            'job_seekers': job_seekers,
            'recruiters': recruiters,
            'companies': companies,
            'jobs': jobs,
            'active_jobs': active_jobs,
            'applications': applications,
            'interviews': interviews,
            'user_growth': user_growth
        })
