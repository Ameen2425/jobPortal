from django.urls import path
from .views import (
    RecommendationView, ResumeAnalysisView, SkillGapView, CoverLetterView, CandidateMatchView
)

urlpatterns = [
    path('recommendations/', RecommendationView.as_view(), name='ai_recommendations'),
    path('resume-analysis/', ResumeAnalysisView.as_view(), name='ai_resume_analysis'),
    path('skill-gap/', SkillGapView.as_view(), name='ai_skill_gap'),
    path('cover-letter/', CoverLetterView.as_view(), name='ai_cover_letter'),
    path('candidate-match/', CandidateMatchView.as_view(), name='ai_candidate_match'),
]
