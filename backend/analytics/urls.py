from django.urls import path
from .views import JobSeekerAnalyticsView, RecruiterAnalyticsView, AdminAnalyticsView

urlpatterns = [
    path('job-seeker/', JobSeekerAnalyticsView.as_view(), name='analytics_job_seeker'),
    path('recruiter/', RecruiterAnalyticsView.as_view(), name='analytics_recruiter'),
    path('admin/', AdminAnalyticsView.as_view(), name='analytics_admin'),
]
