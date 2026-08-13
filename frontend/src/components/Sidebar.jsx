import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, FileText, Send, Bookmark, Sparkles, Target, 
  PenTool, Building, Briefcase, Users, BarChart3, ShieldCheck 
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
                <LayoutDashboard size={18} /> Overview
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                <User size={18} /> My Profile
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/resume" className={({ isActive }) => isActive ? 'active' : ''}>
                <FileText size={18} /> Resume Upload
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/applications" className={({ isActive }) => isActive ? 'active' : ''}>
                <Send size={18} /> My Applications
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/saved-jobs" className={({ isActive }) => isActive ? 'active' : ''}>
                <Bookmark size={18} /> Saved Jobs
              </NavLink>
            </li>
            
            <div style={{ margin: '1rem 0 0.5rem', paddingLeft: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
              AI Intelligence
            </div>

            <li className="sidebar-item">
              <NavLink to="/job-seeker/recommendations" className={({ isActive }) => isActive ? 'active' : ''}>
                <Sparkles size={18} color="var(--primary-600)" /> AI Recommendations
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/resume-analysis" className={({ isActive }) => isActive ? 'active' : ''}>
                <Target size={18} color="var(--accent-cyan)" /> Resume ATS Analyzer
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/skill-gap" className={({ isActive }) => isActive ? 'active' : ''}>
                <BarChart3 size={18} color="var(--accent-emerald)" /> Skill-Gap Analysis
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/job-seeker/cover-letter" className={({ isActive }) => isActive ? 'active' : ''}>
                <PenTool size={18} color="var(--accent-violet)" /> Cover Letter Generator
              </NavLink>
            </li>
          </>
        )}

        {isRecruiter && (
          <>
            <li className="sidebar-item">
              <NavLink to="/recruiter/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <LayoutDashboard size={18} /> Overview
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/recruiter/company" className={({ isActive }) => isActive ? 'active' : ''}>
                <Building size={18} /> Company Profile
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/recruiter/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
                <Briefcase size={18} /> Manage Jobs
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/recruiter/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
                <BarChart3 size={18} /> Hiring Analytics
              </NavLink>
            </li>
          </>
        )}

        {isAdmin && (
          <>
            <li className="sidebar-item">
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <ShieldCheck size={18} /> Platform Admin
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};
