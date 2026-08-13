import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Briefcase, User, LogOut, LayoutDashboard, Sparkles, PlusCircle, Search, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isJobSeeker, isRecruiter, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container-xl navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <Briefcase size={22} />
          </div>
          <span>Hire<span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)' }}>
            PRO
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <ul className="nav-links desktop-only">
          <li>
            <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Search size={16} /> Explore Jobs
            </Link>
          </li>

          {user && isJobSeeker && (
            <>
              <li>
                <Link to="/job-seeker/dashboard" className={`nav-link ${isActive('/job-seeker/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/job-seeker/recommendations" className={`nav-link ${isActive('/job-seeker/recommendations') ? 'active' : ''}`} style={{ color: 'var(--accent-violet)', fontWeight: 700 }}>
                  ✨ AI Matches
                </Link>
              </li>
            </>
          )}

          {user && isRecruiter && (
            <>
              <li>
                <Link to="/recruiter/dashboard" className={`nav-link ${isActive('/recruiter/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recruiter/jobs" className={`nav-link ${isActive('/recruiter/jobs') ? 'active' : ''}`}>
                  Job Posts
                </Link>
              </li>
            </>
          )}

          {user && isAdmin && (
            <li>
              <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                Admin Control
              </Link>
            </li>
          )}
        </ul>

        {/* Right Desktop Action Menu */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && isRecruiter && (
            <Link to="/recruiter/jobs/create" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Post Job
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <NotificationDropdown />

              <Link to={isJobSeeker ? "/job-seeker/profile" : isRecruiter ? "/recruiter/company" : "/admin/dashboard"}>
                <div style={{
                  width: '2.4rem',
                  height: '2.4rem',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.925rem',
                  boxShadow: 'var(--shadow-glow)',
                  border: '2px solid white'
                }}>
                  {user.first_name?.[0] || user.username?.[0] || 'U'}
                </div>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user && <NotificationDropdown />}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn btn-secondary btn-sm" 
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer animate-fade-in">
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
            🔍 Explore Jobs
          </Link>

          {user && isJobSeeker && (
            <>
              <Link to="/job-seeker/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                📊 Job Seeker Dashboard
              </Link>
              <Link to="/job-seeker/recommendations" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                ✨ AI Matches
              </Link>
              <Link to="/job-seeker/profile" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                👤 My Profile
              </Link>
              <Link to="/job-seeker/resume-analysis" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                📄 ATS Resume Analyzer
              </Link>
            </>
          )}

          {user && isRecruiter && (
            <>
              <Link to="/recruiter/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                💼 Recruiter Dashboard
              </Link>
              <Link to="/recruiter/jobs" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                📋 Manage Jobs
              </Link>
              <Link to="/recruiter/jobs/create" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link" style={{ color: 'var(--primary-600)', fontWeight: 800 }}>
                ➕ Post New Job
              </Link>
            </>
          )}

          {user && isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              🛡️ Admin Control Panel
            </Link>
          )}

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)' }}>
            {user ? (
              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={16} /> Log Out
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'center' }}>Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center' }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
