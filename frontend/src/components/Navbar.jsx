import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Briefcase, User, LogOut, LayoutDashboard, Sparkles, PlusCircle, Search } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isJobSeeker, isRecruiter, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container-xl navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Briefcase size={22} />
          </div>
          <span>Hire<span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)' }}>
            PRO
          </span>
        </Link>

        {/* Center Nav Items */}
        <ul className="nav-links">
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

        {/* Right Action Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
      </div>
    </nav>
  );
};
