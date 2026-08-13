from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from .services.recommendation_engine import get_recommendations_for_user
from .services.resume_analyzer import extract_text_from_pdf, analyze_resume_content
from .services.skill_gap import analyze_skill_gap
from .services.cover_letter import generate_cover_letter
from .services.candidate_matcher import match_candidates_for_job

from jobs.models import Job
from jobs.serializers import JobSerializer
from applications.models import Application
from accounts.models import JobSeekerProfile

class RecommendationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        recommendations = get_recommendations_for_user(user, limit=15)
        
        results = []
        for rec in recommendations:
            job_data = JobSerializer(rec['job'], context={'request': request}).data
            results.append({
                'job': job_data,
                'match_score': rec['match_score'],
                'skills_match': rec['skills_match'],
                'experience_match': rec['experience_match'],
                'location_match': rec['location_match']
            })

        return Response({'recommendations': results})


class ResumeAnalysisView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        pdf_file = request.FILES.get('resume')
        text = ""
        
        if pdf_file:
            text = extract_text_from_pdf(pdf_file)
        else:
            # Try to fetch existing saved resume
            profile = getattr(request.user, 'job_seeker_profile', None)
            if profile and profile.resume:
                try:
                    text = extract_text_from_pdf(profile.resume.file)
                except Exception:
                    text = f"{profile.headline} {profile.bio}"

        if not text:
            # Generate analysis based on registered user profile details
            profile = getattr(request.user, 'job_seeker_profile', None)
            text = f"{profile.headline if profile else ''} {profile.bio if profile else ''}"

        user_skills = list(request.user.skills.values_list('skill_name', flat=True))
        analysis = analyze_resume_content(text, user_skills)
        return Response(analysis)


class SkillGapView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        job_id = request.data.get('job_id')
        job = get_object_or_404(Job, pk=job_id) if job_id else None

        job_skills = job.skills if job else request.data.get('job_skills', 'Python, Django, React, MySQL, AWS, Docker')
        candidate_skills = list(request.user.skills.values_list('skill_name', flat=True))

        gap_analysis = analyze_skill_gap(candidate_skills, job_skills)
        if job:
            gap_analysis['job_title'] = job.title
            gap_analysis['company_name'] = job.company.company_name

        return Response(gap_analysis)


class CoverLetterView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        job_id = request.data.get('job_id')
        job = get_object_or_404(Job, pk=job_id) if job_id else None

        job_title = job.title if job else request.data.get('job_title', 'Software Engineer')
        company_name = job.company.company_name if job else request.data.get('company_name', 'Innovate Tech Inc')
        
        candidate_name = request.user.get_full_name() or request.user.username
        candidate_skills = list(request.user.skills.values_list('skill_name', flat=True))
        custom_notes = request.data.get('custom_notes', '')

        letter = generate_cover_letter(
            candidate_name=candidate_name,
            job_title=job_title,
            company_name=company_name,
            candidate_skills=candidate_skills,
            custom_notes=custom_notes
        )

        return Response({'cover_letter': letter, 'job_title': job_title, 'company_name': company_name})


class CandidateMatchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        job = get_object_or_404(Job, pk=job_id)
        applications = Application.objects.filter(job=job).select_related('candidate', 'candidate__job_seeker_profile')

        ranked_candidates = match_candidates_for_job(job, applications)
        return Response({
            'job_id': job.id,
            'job_title': job.title,
            'total_candidates': len(ranked_candidates),
            'candidates': ranked_candidates
        })
