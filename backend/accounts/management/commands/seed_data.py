import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

from accounts.models import JobSeekerProfile, Skill, Education, Experience, Certification
from companies.models import Company
from jobs.models import Job, SavedJob
from applications.models import Application
from notifications.models import Notification
from interviews.models import Interview

User = get_user_model()

TECH_TITLES = [
    "Full Stack Python Developer", "Senior React Developer", "Backend Django Engineer",
    "Frontend UI/UX Developer", "Data Scientist & ML Engineer", "DevOps Engineer",
    "Product Manager", "Cloud Solutions Architect", "QA Automation Engineer",
    "Cybersecurity Specialist", "Mobile App Developer (React Native)", "AI/ML Solutions Lead"
]

SKILL_SETS = [
    ["Python", "Django", "React", "MySQL", "Git", "REST APIs"],
    ["JavaScript", "React", "Redux", "Tailwind CSS", "HTML5", "CSS3"],
    ["Python", "Scikit-Learn", "Pandas", "NumPy", "TensorFlow", "SQL"],
    ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Python"],
    ["Node.js", "Express", "TypeScript", "MongoDB", "PostgreSQL"],
    ["Java", "Spring Boot", "MySQL", "Microservices", "Docker"]
]

COMPANY_NAMES = [
    ("TechCorp Solutions", "Technology", "100-500 employees", "https://techcorp.example.com"),
    ("InnovateAI Labs", "Artificial Intelligence", "50-100 employees", "https://innovateai.example.com"),
    ("CloudScale Systems", "Cloud Infrastructure", "200-1000 employees", "https://cloudscale.example.com"),
    ("NextGen FinTech", "Financial Services", "500+ employees", "https://nextgenfintech.example.com"),
    ("CyberShield Security", "Cybersecurity", "20-50 employees", "https://cybershield.example.com"),
    ("Apex HealthTech", "Healthcare", "100-250 employees", "https://apexhealth.example.com"),
    ("ByteWise Media", "Digital Media", "10-50 employees", "https://bytewise.example.com"),
    ("OmniRetail E-Commerce", "E-Commerce", "500+ employees", "https://omniretail.example.com"),
    ("DataFlow Analytics", "Big Data", "50-200 employees", "https://dataflow.example.com"),
    ("Quantum Software", "Software Engineering", "100-500 employees", "https://quantum.example.com")
]

LOCATIONS = ["Hyderabad, India", "Bengaluru, India", "Mumbai, India", "Pune, India", "Remote", "San Francisco, CA", "New York, NY"]

class Command(BaseCommand):
    help = "Seeds database with realistic demo data for HireAI platform."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Starting database seeding process..."))

        # 1. Create Superuser / Admin
        admin_email = "admin@hireai.com"
        admin, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'username': 'admin',
                'first_name': 'HireAI',
                'last_name': 'Administrator',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'is_verified': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS("Created Admin: admin@hireai.com / admin123"))

        # 2. Create 5 Recruiters
        recruiters = []
        for i in range(1, 6):
            r_email = f"recruiter{i}@hireai.com"
            recruiter, r_created = User.objects.get_or_create(
                email=r_email,
                defaults={
                    'username': f"recruiter{i}",
                    'first_name': f"Recruiter",
                    'last_name': f"User {i}",
                    'role': User.Role.RECRUITER,
                    'phone': f"+91 987654320{i}",
                    'is_verified': True
                }
            )
            if r_created:
                recruiter.set_password("password123")
                recruiter.save()
            recruiters.append(recruiter)
        self.stdout.write(self.style.SUCCESS(f"Created {len(recruiters)} Recruiters."))

        # 3. Create 10 Companies
        companies = []
        for idx, (name, ind, size, web) in enumerate(COMPANY_NAMES):
            recruiter = recruiters[idx % len(recruiters)]
            comp, _ = Company.objects.get_or_create(
                company_name=name,
                defaults={
                    'recruiter': recruiter,
                    'industry': ind,
                    'company_size': size,
                    'website': web,
                    'location': random.choice(LOCATIONS),
                    'description': f"Leading innovator in {ind.lower()} delivering high-performance SaaS software worldwide.",
                    'founded_year': random.randint(2012, 2022)
                }
            )
            companies.append(comp)
        self.stdout.write(self.style.SUCCESS(f"Created {len(companies)} Companies."))

        # 4. Create 20 Job Seekers with Profiles, Skills, Education, Experience
        job_seekers = []
        for i in range(1, 21):
            s_email = f"candidate{i}@hireai.com"
            candidate, c_created = User.objects.get_or_create(
                email=s_email,
                defaults={
                    'username': f"candidate{i}",
                    'first_name': f"Candidate",
                    'last_name': f"User {i}",
                    'role': User.Role.JOB_SEEKER,
                    'phone': f"+91 91234567{i:02d}",
                    'is_verified': True
                }
            )
            if c_created:
                candidate.set_password("password123")
                candidate.save()
            
            job_seekers.append(candidate)

            profile, _ = JobSeekerProfile.objects.get_or_create(
                user=candidate,
                defaults={
                    'headline': f"Passionate {random.choice(TECH_TITLES)} with {random.randint(1, 6)} years experience",
                    'bio': "Dedicated software developer driven by crafting scalable web systems, clean architecture, and continuous learning.",
                    'location': random.choice(LOCATIONS),
                    'github_url': f"https://github.com/candidate{i}",
                    'linkedin_url': f"https://linkedin.com/in/candidate{i}",
                    'profile_completion': 85
                }
            )

            # Seed Skills
            selected_skills = random.choice(SKILL_SETS)
            for skill_name in selected_skills:
                Skill.objects.get_or_create(
                    user=candidate,
                    skill_name=skill_name,
                    defaults={'skill_level': random.choice(['INTERMEDIATE', 'ADVANCED', 'EXPERT'])}
                )

            # Seed Education
            Education.objects.get_or_create(
                user=candidate,
                institution="National Institute of Technology",
                defaults={
                    'degree': "Bachelor of Technology",
                    'field_of_study': "Computer Science & Engineering",
                    'start_date': date(2018, 8, 1),
                    'end_date': date(2022, 5, 30),
                    'grade': "8.5 CGPA"
                }
            )

            # Seed Experience
            Experience.objects.get_or_create(
                user=candidate,
                company="Global Tech Services",
                defaults={
                    'job_title': "Software Developer",
                    'start_date': date(2022, 6, 1),
                    'end_date': date(2024, 6, 1),
                    'description': "Developed REST APIs using Python/Django, integrated frontend React components, and optimized database queries."
                }
            )

        self.stdout.write(self.style.SUCCESS(f"Created {len(job_seekers)} Job Seekers with full profiles."))

        # 5. Create 30 Jobs
        jobs = []
        for i in range(1, 31):
            comp = random.choice(companies)
            skills_sample = random.choice(SKILL_SETS)
            title = random.choice(TECH_TITLES)
            job, _ = Job.objects.get_or_create(
                title=f"{title} ({i})",
                company=comp,
                defaults={
                    'recruiter': comp.recruiter,
                    'description': f"We are seeking an exceptional {title} to join our high-growth engineering team at {comp.company_name}. You will be building cutting-edge SaaS products using modern web frameworks.",
                    'responsibilities': "• Design and develop high-throughput REST APIs\n• Collaborate with cross-functional product and UI design teams\n• Write clean, testable code and optimize database queries",
                    'requirements': f"• 2+ years experience in {', '.join(skills_sample[:3])}\n• Strong understanding of relational databases (MySQL/PostgreSQL)\n• Experience with Git and agile methodologies",
                    'location': comp.location,
                    'job_type': random.choice(['FULL_TIME', 'FULL_TIME', 'CONTRACT', 'INTERNSHIP']),
                    'work_mode': random.choice(['REMOTE', 'HYBRID', 'ON_SITE']),
                    'experience_level': random.choice(['ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR']),
                    'salary_min': random.randint(6, 14) * 100000,
                    'salary_max': random.randint(15, 25) * 100000,
                    'skills': ", ".join(skills_sample),
                    'deadline': date.today() + timedelta(days=random.randint(15, 60)),
                    'status': 'PUBLISHED'
                }
            )
            jobs.append(job)
        self.stdout.write(self.style.SUCCESS(f"Created {len(jobs)} Jobs."))

        # 6. Create 40 Applications
        app_count = 0
        statuses = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']
        for _ in range(40):
            cand = random.choice(job_seekers)
            job = random.choice(jobs)
            if not Application.objects.filter(job=job, candidate=cand).exists():
                app_status = random.choice(statuses)
                app = Application.objects.create(
                    job=job,
                    candidate=cand,
                    cover_letter=f"Dear Hiring Manager,\n\nI am thrilled to apply for {job.title} at {job.company.company_name}. My background in {job.skills} fits your requirements perfectly.",
                    status=app_status
                )
                app_count += 1

                # If status is INTERVIEW, schedule an interview
                if app_status == 'INTERVIEW':
                    Interview.objects.create(
                        application=app,
                        scheduled_by=job.recruiter,
                        interview_date=date.today() + timedelta(days=random.randint(2, 10)),
                        interview_time="14:00:00",
                        meeting_link="https://meet.google.com/hireai-interview-demo",
                        notes="Technical round focusing on system design, Django REST, and live coding.",
                        status='SCHEDULED'
                    )

                # Add Notification
                Notification.objects.create(
                    user=cand,
                    title=f"Application Update: {job.title}",
                    message=f"Your application status for {job.title} at {job.company.company_name} is now: {app_status}",
                    notification_type="STATUS_CHANGE",
                    link="/job-seeker/applications"
                )

        self.stdout.write(self.style.SUCCESS(f"Created {app_count} Job Applications and Notifications/Interviews."))
        self.stdout.write(self.style.SUCCESS("HireAI database seeding completed successfully!"))
