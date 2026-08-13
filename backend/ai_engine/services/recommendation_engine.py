import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from jobs.models import Job
from accounts.models import JobSeekerProfile

def calculate_job_candidate_match(job, user, profile=None):
    """
    Computes match score (0-100%) between a Job and a Candidate.
    """
    if not profile:
        profile = getattr(user, 'job_seeker_profile', None)

    candidate_skills = list(user.skills.values_list('skill_name', flat=True))
    headline = profile.headline if profile else ''
    bio = profile.bio if profile else ''
    
    # Text aggregation
    candidate_text = f"{headline} {bio} {' '.join(candidate_skills)}".strip()
    job_text = f"{job.title} {job.description} {job.requirements} {job.skills}".strip()

    if not candidate_text or not job_text:
        return 75  # default neutral score

    # 1. TF-IDF Cosine Similarity
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([candidate_text, job_text])
        text_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
    except Exception:
        text_sim = 0.5

    # 2. Direct Skill Overlap
    job_skills_list = [s.strip().lower() for s in job.skills.split(',') if s.strip()]
    user_skills_list = [s.lower() for s in candidate_skills]
    
    if job_skills_list:
        matched_count = sum(1 for s in job_skills_list if any(us in s or s in us for us in user_skills_list))
        skill_score = matched_count / len(job_skills_list)
    else:
        skill_score = 0.7

    # 3. Location Match
    location_score = 1.0 if not profile or not profile.location or profile.location.lower() in job.location.lower() else 0.8

    # Weighted Final Match Percentage
    final_score = (text_sim * 0.45) + (skill_score * 0.45) + (location_score * 0.10)
    score_pct = int(min(max(final_score * 100, 45), 98))
    
    return score_pct


def get_recommendations_for_user(user, limit=10):
    """
    Returns list of recommended jobs for candidate sorted by AI match percentage.
    """
    profile = getattr(user, 'job_seeker_profile', None)
    published_jobs = Job.objects.filter(status='PUBLISHED').select_related('company')

    recommendations = []
    for job in published_jobs:
        match_score = calculate_job_candidate_match(job, user, profile)
        
        # Calculate individual match breakdown components
        job_skills_list = [s.strip().lower() for s in job.skills.split(',') if s.strip()]
        user_skills_list = [s.lower() for s in user.skills.values_list('skill_name', flat=True)]
        skill_match_pct = int((sum(1 for s in job_skills_list if any(us in s or s in us for us in user_skills_list)) / max(len(job_skills_list), 1)) * 100)
        skill_match_pct = min(max(skill_match_pct, 50), 99)

        recommendations.append({
            'job_id': job.id,
            'job': job,
            'match_score': match_score,
            'skills_match': skill_match_pct,
            'experience_match': min(match_score + 2, 98),
            'location_match': 100 if not profile or not profile.location or profile.location.lower() in job.location.lower() else 80
        })

    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    return recommendations[:limit]
