def generate_cover_letter(candidate_name, job_title, company_name, candidate_skills, experience_summary="", custom_notes=""):
    """
    Generates a personalized, professional cover letter.
    """
    skills_str = ", ".join(candidate_skills) if candidate_skills else "software engineering and modern web development"
    
    cover_letter = f"""Dear Hiring Manager,

I am writing to express my strong enthusiasm for the {job_title} position at {company_name}. With my solid background in {skills_str}, I am confident in my ability to make an immediate, impactful contribution to your engineering team.

Throughout my career, I have developed expertise in building scalable, robust software solutions. {experience_summary if experience_summary else 'My experience spans designing clean RESTful APIs, optimizing application performance, and collaborating effectively in modern tech environments.'}

What excites me about {company_name} is your commitment to innovation and delivering high-performance products. My core strengths in {skills_str} directly align with your requirements, enabling me to deliver quality code and drive team goals forward.

{f"Additional context: {custom_notes}" if custom_notes else ""}

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical skills and enthusiasm make me a strong fit for {company_name}.

Sincerely,
{candidate_name}"""

    return cover_letter.strip()
