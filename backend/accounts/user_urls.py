from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, EducationViewSet, ExperienceViewSet, CertificationViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'certifications', CertificationViewSet, basename='certification')

urlpatterns = [
    path('', include(router.urls)),
]
