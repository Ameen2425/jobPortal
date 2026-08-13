from ai_engine.services.recommendation_engine import calculate_job_candidate_match

def match_candidates_for_job(job, applications_or_candidates):
    """
    Ranks applicants or candidates for a recruiter's job post.
    """
    results = []

    for item in applications_or_candidates:
        if hasattr(item, 'candidate'):  # Application object
            candidate = item.candidate
            application = item
        else:  # User object
            candidate = item
            application = None

        profile = getattr(candidate, 'job_seeker_profile', None)
        overall_match = calculate_job_candidate_match(job, candidate, profile)

        # Breakdowns
        job_skills = [s.strip().lower() for s in job.skills.split(',') if s.strip()]
        cand_skills = [s.skill_name.lower() for s in candidate.skills.all()] if hasattr(candidate, 'skills') else []
        
        matched_skills_count = sum(1 for js in job_skills if any(cs in js or js in cs for cs in cand_skills))
        skills_match_pct = int((matched_skills_count / max(len(job_skills), 1)) * 100)
        skills_match_pct = min(max(skills_match_pct, 45), 98)

        results.append({
            'candidate_id': candidate.id,
            'candidate_name': candidate.get_full_name() or candidate.username,
            'candidate_email': candidate.email,
            'application_id': application.id if application else None,
            'application_status': application.status if application else None,
            'ai_match_score': overall_match,
            'skills_match': skills_match_pct,
            'experience_match': min(overall_match + 3, 98),
            'education_match': 90 if candidate.education.exists() else 75,
            'project_match': 92 if profile and profile.github_url else 80,
            'matched_skills_count': matched_skills_count,
            'total_required_skills': len(job_skills)
        })

    results.sort(key=lambda x: x['ai_match_score'], reverse=True)
    return results
