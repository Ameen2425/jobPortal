def analyze_skill_gap(candidate_skills, job_skills):
    """
    Compares candidate skills against job requirements.
    """
    if isinstance(job_skills, str):
        required_list = [s.strip() for s in job_skills.split(',') if s.strip()]
    else:
        required_list = list(job_skills)

    candidate_list = [s.strip().lower() for s in candidate_skills]

    matched = []
    missing = []

    for req in required_list:
        req_lower = req.lower()
        if any(c in req_lower or req_lower in c for c in candidate_list):
            matched.append(req)
        else:
            missing.append(req)

    total_required = len(required_list) if required_list else 1
    match_percentage = int((len(matched) / total_required) * 100)

    # General recommendations based on missing skills
    industry_recommendations = ['Docker', 'AWS', 'System Design', 'CI/CD Pipelines', 'RESTful API Optimization']
    recommended_skills = missing + [s for s in industry_recommendations if s.lower() not in [m.lower() for m in matched]][:3]

    return {
        'readiness_percentage': min(max(match_percentage, 40), 100),
        'matched_skills': matched,
        'missing_skills': missing,
        'recommended_skills': list(set(recommended_skills))
    }
