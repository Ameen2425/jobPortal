import PyPDF2
import re

COMMON_TECH_SKILLS = [
    'python', 'django', 'react', 'javascript', 'html', 'css', 'mysql', 'postgresql',
    'docker', 'aws', 'git', 'rest api', 'node.js', 'typescript', 'java', 'c++',
    'machine learning', 'scikit-learn', 'pandas', 'numpy', 'redux', 'tailwind',
    'mongodb', 'agile', 'linux', 'ci/cd', 'kubernetes', 'graphql', 'figma'
]

def extract_text_from_pdf(pdf_file):
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
    except Exception as e:
        return ""

def analyze_resume_content(text, user_skills=None):
    if not text:
        text = ""

    text_lower = text.lower()
    
    # 1. Found skills
    found_skills = []
    for skill in COMMON_TECH_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            found_skills.append(skill.title())

    if user_skills:
        for s in user_skills:
            if s.title() not in found_skills:
                found_skills.append(s.title())

    # 2. Section Checks
    has_education = any(w in text_lower for w in ['education', 'university', 'bachelor', 'master', 'degree', 'college'])
    has_experience = any(w in text_lower for w in ['experience', 'work', 'employment', 'position', 'role', 'developer', 'engineer'])
    has_projects = any(w in text_lower for w in ['project', 'portfolio', 'github', 'built', 'developed'])
    has_contact = any(w in text_lower for w in ['email', 'phone', 'contact', '@', 'linkedin'])

    # 3. Calculate Score out of 100
    score = 40  # Base score
    if has_education: score += 15
    if has_experience: score += 15
    if has_projects: score += 15
    if has_contact: score += 15
    score += min(len(found_skills) * 2, 20)
    score = min(max(score, 50), 98)

    # 4. Strengths & Weaknesses
    strengths = []
    weaknesses = []
    suggestions = []

    if len(found_skills) >= 5:
        strengths.append(f"Strong technical skill set detected ({', '.join(found_skills[:4])}).")
    else:
        weaknesses.append("Limited technical keywords detected in resume body.")
        suggestions.append("Add explicit technology keywords (e.g. Python, React, SQL, Git).")

    if has_experience:
        strengths.append("Clear work history/experience section identified.")
    else:
        weaknesses.append("Work experience section is missing or lacks standard headers.")
        suggestions.append("Structure work experience with clear Job Title, Company Name, and Dates.")

    if has_projects:
        strengths.append("Projects/Portfolio section included.")
    else:
        suggestions.append("Add a Projects section featuring GitHub/live links to demonstrate hands-on experience.")

    if has_education:
        strengths.append("Formal education details present.")
    else:
        weaknesses.append("Education section not clearly identified.")

    missing_keywords = [s.title() for s in ['Docker', 'AWS', 'REST APIs', 'Unit Testing', 'CI/CD'] if s.lower() not in text_lower]

    return {
        'score': score,
        'detected_skills': list(set(found_skills)),
        'strengths': strengths if strengths else ["Resume has readable text structure."],
        'weaknesses': weaknesses if weaknesses else ["Minor formatting improvements recommended."],
        'missing_keywords': missing_keywords,
        'suggestions': suggestions if suggestions else ["Quantify achievements using metrics (e.g. Improved performance by 30%)."],
        'has_education': has_education,
        'has_experience': has_experience,
        'has_projects': has_projects,
    }
