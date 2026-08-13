import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, FileText, Send, Bookmark, Sparkles, Target, 
  PenTool, Building, Briefcase, BarChart3, ShieldCheck 
} from 'lucide-react';

export const Sidebar = () => {
  const { isJobSeeker, isRecruiter, isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {isJobSeeker && (
          <>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <LayoutDashboard size={18} /> <span>Overview</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                <User size={18} /> <span>My Profile</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/resume" className={({ isActive }) => isActive ? 'active' : ''}>
                <FileText size={18} /> <span>Resume Upload</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/applications" className={({ isActive }) => isActive ? 'active' : ''}>
                <Send size={18} /> <span>Applications</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/saved-jobs" className={({ isActive }) => isActive ? 'active' : ''}>
                <Bookmark size={18} /> <span>Saved Jobs</span>
              </NavLink>
            </li>

            <li className="sidebar-divider desktop-only">AI Intelligence</li>

            <li className="sidebar-item">
              <NavLink to="/job-seeker/recommendations" className={({ isActive }) => isActive ? 'active' : ''}>
                <Sparkles size={18} color="var(--primary-600)" /> <span>AI Matches</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/resume-analysis" className={({ isActive }) => isActive ? 'active' : ''}>
                <Target size={18} color="var(--accent-cyan)" /> <span>ATS Analyzer</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/skill-gap" className={({ isActive }) => isActive ? 'active' : ''}>
                <BarChart3 size={18} color="var(--accent-emerald)" /> <span>Skill-Gap</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/cover-letter" className={({ isActive }) => isActive ? 'active' : ''}>
                <PenTool size={18} color="var(--accent-violet)" /> <span>Cover Letter</span>
              </NavLink>
            </li>
          </>
        )}

        {isRecruiter && (
          <>
            <li className="sidebar-item">
              <NavLink to="/recruiter/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <LayoutDashboard size={18} /> <span>Overview</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/recruiter/company" className={({ isActive }) => isActive ? 'active' : ''}>
                <Building size={18} /> <span>Company Profile</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/recruiter/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
                <Briefcase size={18} /> <span>Manage Jobs</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/recruiter/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
                <BarChart3 size={18} /> <span>Hiring Analytics</span>
              </NavLink>
            </li>
          </>
        )}

        {isAdmin && (
          <>
            <li className="sidebar-item">
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <ShieldCheck size={18} /> <span>Platform Admin</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};
