import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: 'var(--slate-900)', color: 'var(--slate-300)', padding: '4rem 0 2rem', marginTop: 'auto' }}>
      <div className="container-xl" style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            <Briefcase size={24} color="var(--primary-500)" />
            <span>Hire<span style={{ color: 'var(--primary-500)' }}>AI</span></span>
          </div>
          <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '320px' }}>
            Next-generation recruitment platform connecting ambitious talent with top companies through AI-powered job matching & candidate intelligence.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>For Job Seekers</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <li><Link to="/jobs" style={{ color: 'var(--slate-400)' }}>Browse All Jobs</Link></li>
            <li><Link to="/job-seeker/recommendations" style={{ color: 'var(--slate-400)' }}>AI Job Matches</Link></li>
            <li><Link to="/job-seeker/resume-analysis" style={{ color: 'var(--slate-400)' }}>Resume ATS Analyzer</Link></li>
            <li><Link to="/job-seeker/skill-gap" style={{ color: 'var(--slate-400)' }}>Skill Gap Analysis</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>For Employers</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <li><Link to="/recruiter/jobs/create" style={{ color: 'var(--slate-400)' }}>Post a Job</Link></li>
            <li><Link to="/recruiter/dashboard" style={{ color: 'var(--slate-400)' }}>AI Candidate Matcher</Link></li>
            <li><Link to="/recruiter/company" style={{ color: 'var(--slate-400)' }}>Company Profile</Link></li>
            <li><Link to="/recruiter/analytics" style={{ color: 'var(--slate-400)' }}>Hiring Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <li><a href="#features" style={{ color: 'var(--slate-400)' }}>AI Engine</a></li>
            <li><a href="#statistics" style={{ color: 'var(--slate-400)' }}>Platform Stats</a></li>
            <li><Link to="/login" style={{ color: 'var(--slate-400)' }}>Login / Signup</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-xl" style={{ borderTop: '1px solid var(--slate-800)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
        <p>© {new Date().getFullYear()} HireAI Platform Inc. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="#" style={{ color: 'var(--slate-400)' }}><Github size={18} /></a>
          <a href="#" style={{ color: 'var(--slate-400)' }}><Linkedin size={18} /></a>
          <a href="#" style={{ color: 'var(--slate-400)' }}><Twitter size={18} /></a>
        </div>
      </div>
    </footer>
  );
};
