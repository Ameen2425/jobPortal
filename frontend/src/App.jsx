import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { JobSearch } from './pages/JobSearch';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { CompanyDetails } from './pages/CompanyDetails';

// Job Seeker Pages
import { JobSeekerDashboard } from './pages/JobSeekerDashboard';
import { Profile } from './pages/Profile';
import { Resume } from './pages/Resume';
import { Applications } from './pages/Applications';
import { SavedJobs } from './pages/SavedJobs';
import { Recommendations } from './pages/Recommendations';
import { ResumeAnalysis } from './pages/ResumeAnalysis';
import { SkillGap } from './pages/SkillGap';
import { CoverLetter } from './pages/CoverLetter';

// Recruiter Pages
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { CompanyManagement } from './pages/CompanyManagement';
import { JobsManagement } from './pages/JobsManagement';
import { CreateJob } from './pages/CreateJob';
import { EditJob } from './pages/EditJob';
import { ApplicantList } from './pages/ApplicantList';
import { RecruiterAnalytics } from './pages/RecruiterAnalytics';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';

import './App.css';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Job Seeker Protected Routes */}
          <Route path="/job-seeker/dashboard" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><JobSeekerDashboard /></ProtectedRoute>} />
          <Route path="/job-seeker/profile" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><Profile /></ProtectedRoute>} />
          <Route path="/job-seeker/resume" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><Resume /></ProtectedRoute>} />
          <Route path="/job-seeker/applications" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><Applications /></ProtectedRoute>} />
          <Route path="/job-seeker/saved-jobs" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><SavedJobs /></ProtectedRoute>} />
          <Route path="/job-seeker/recommendations" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><Recommendations /></ProtectedRoute>} />
          <Route path="/job-seeker/resume-analysis" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><ResumeAnalysis /></ProtectedRoute>} />
          <Route path="/job-seeker/skill-gap" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><SkillGap /></ProtectedRoute>} />
          <Route path="/job-seeker/cover-letter" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><CoverLetter /></ProtectedRoute>} />

          {/* Recruiter Protected Routes */}
          <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/company" element={<ProtectedRoute allowedRoles={['RECRUITER']}><CompanyManagement /></ProtectedRoute>} />
          <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['RECRUITER']}><JobsManagement /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/create" element={<ProtectedRoute allowedRoles={['RECRUITER']}><CreateJob /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute allowedRoles={['RECRUITER']}><EditJob /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute allowedRoles={['RECRUITER']}><ApplicantList /></ProtectedRoute>} />
          <Route path="/recruiter/analytics" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterAnalytics /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
