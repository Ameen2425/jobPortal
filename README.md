# HireAI — Unified AI-Powered Job Portal

> **Find the Right Job. Build the Right Career.**

HireAI is a modern, production-style recruitment SaaS platform connecting **Job Seekers**, **Employers / Recruiters**, and **Admins** through an intelligent machine learning job matching engine.

---

## ⚡ Unified Full-Stack Server

The frontend React single-page application (SPA) and Django REST Framework API are seamlessly integrated into a single unified server.

### Launch Both Frontend & Backend with One Command:

```bash
# Launch unified full-stack server on http://127.0.0.1:8000
python run_app.py
```

* **Frontend App & Landing Page**: `http://127.0.0.1:8000/`
* **REST API Endpoints**: `http://127.0.0.1:8000/api/`
* **Django Super Admin**: `http://127.0.0.1:8000/admin/`

---

## 🌟 Architecture & Key Features

### 🤖 AI Engine (5 Core ML Services)
1. **Job Recommendation Engine**: Utilizes Scikit-learn **TF-IDF Vectorization** and **Cosine Similarity** to compute exact job-to-candidate match percentages (0-100%).
2. **Resume ATS Analyzer**: Extracts text from PDF resumes using `PyPDF2`, analyzes keyword density, section headers, strengths, weaknesses, and calculates ATS compatibility scores out of 100.
3. **Skill-Gap Analyzer**: Compares candidate profile skills directly against job requirements, identifying matched vs missing skills and generating personalized upskilling plans.
4. **AI Cover Letter Generator**: Generates customized, high-converting cover letters based on profile data, skills, and target job postings.
5. **AI Candidate Matcher for Recruiters**: Ranks all applicants or candidates for a recruiter's job post by weighted AI match scores.

### 👤 Role-Based Capabilities
* **Job Seeker**: Register, login, profile management, PDF resume upload, multi-filter job search, application tracking timeline, saved jobs, AI recommendations, skill gap analyzer, cover letter generator, notification system.
* **Recruiter / Employer**: Register, company profile management, post/edit/delete/publish/close jobs, applicant screening with AI candidate ranking, status updates (Shortlist/Reject), interview scheduling modal, hiring analytics funnel.
* **Super Admin**: Platform metrics overview, user growth analytics, company & job monitoring, content moderation controls.

---

## 🛠️ Technology Stack

* **Backend**: Python 3.14, Django 5.1, Django REST Framework, Simple JWT, PyPDF2, Scikit-Learn, PyMySQL / MySQL client, `django-cors-headers`.
* **Database**: **MySQL** (`hireai_db`) running on port `3307` / `3306` with Django ORM.
* **Frontend**: React 18 (Vite), JavaScript, React Router v6, Axios, Context API (`AuthContext`), Lucide React Icons, Recharts, Vanilla CSS design tokens.

---

## 📁 Repository Structure

```text
HireAI/
├── run_app.py            # Single-command unified launcher script
├── backend/
│   ├── accounts/          # Custom User, JobSeekerProfile, Skill, Education, Experience, Certification
│   ├── companies/         # Company model and recruiter company profile views
│   ├── jobs/              # Job and SavedJob models, multi-filter search views
│   ├── applications/     # Application tracking, double-apply protection, status triggers
│   ├── notifications/    # Real-time notification system and unread badge count
│   ├── interviews/       # Interview scheduling system with automated candidate alerts
│   ├── ai_engine/         # 5 Machine Learning services (TF-IDF, Cosine Sim, PDF Parser)
│   ├── analytics/         # Job Seeker, Recruiter, and Admin analytics endpoints
│   ├── config/            # Django settings, JWT configuration, MySQL connection, SPA static views
│   ├── common/            # Custom permissions, pagination, and utilities
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── dist/              # Production static build served directly by Django
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, JobCard, ApplicationTimeline, AIAnalysisCard, etc.)
│   │   ├── context/       # AuthContext state management
│   │   ├── pages/         # Landing, Search, Dashboards, AI features, Profiles, Management
│   │   ├── services/      # Axios service layer (authService, jobService, aiService, etc.)
│   │   ├── App.jsx        # Route tree & ProtectedRoute guards
│   │   └── App.css        # Recruitment SaaS CSS design system & design tokens
│   ├── package.json
│   └── index.html
└── README.md
```

---

## 🔑 Demo Credentials

* **Super Admin**: `admin@hireai.com` / `admin123`
* **Recruiter**: `recruiter1@hireai.com` / `password123`
* **Job Seeker**: `candidate1@hireai.com` / `password123`

---

## 📡 REST API Documentation

* `POST /api/auth/register/`: Register Job Seeker or Recruiter
* `POST /api/auth/login/`: JWT authentication (returns access & refresh tokens)
* `GET /api/auth/profile/`: Get logged-in user profile & completion score
* `GET /api/jobs/`: Multi-filtered job discovery with pagination & search
* `POST /api/applications/`: Apply for job with cover letter & resume file
* `GET /api/ai/recommendations/`: TF-IDF Cosine similarity job matches
* `POST /api/ai/resume-analysis/`: PDF resume text extraction & ATS scoring
* `POST /api/ai/skill-gap/`: Skill gap matrix analysis
* `POST /api/ai/cover-letter/`: Personal cover letter generation
* `POST /api/ai/candidate-match/`: Recruiter applicant AI ranking
