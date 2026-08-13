import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, Building, Mail, Lock, Phone, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [role, setRole] = useState('JOB_SEEKER');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await register({
        username: username || email.split('@')[0],
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        password,
        confirm_password: confirmPassword,
        role
      });
      navigate(role === 'JOB_SEEKER' ? '/job-seeker/dashboard' : '/recruiter/dashboard');
    } catch (err) {
      const errObj = err.response?.data;
      if (errObj && typeof errObj === 'object') {
        const firstKey = Object.keys(errObj)[0];
        const val = errObj[firstKey];
        setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)', padding: '2rem 1.5rem' }}>
      <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '2.5rem', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary-600), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Briefcase size={22} />
            </div>
            <span>Hire<span style={{ color: 'var(--primary-600)' }}>AI</span></span>
          </Link>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '1rem', color: 'var(--slate-900)' }}>Create Your Account</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>Join the AI recruitment platform</p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setRole('JOB_SEEKER')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${role === 'JOB_SEEKER' ? 'var(--primary-600)' : 'var(--slate-200)'}`,
              background: role === 'JOB_SEEKER' ? 'var(--primary-50)' : 'white',
              color: role === 'JOB_SEEKER' ? 'var(--primary-700)' : 'var(--slate-600)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <User size={18} /> I'm a Job Seeker
          </button>

          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${role === 'RECRUITER' ? 'var(--primary-600)' : 'var(--slate-200)'}`,
              background: role === 'RECRUITER' ? 'var(--primary-50)' : 'white',
              color: role === 'RECRUITER' ? 'var(--primary-700)' : 'var(--slate-600)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Building size={18} /> I'm an Employer
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" required className="form-input" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" required className="form-input" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" required className="form-input" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-input" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" required minLength={6} className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" required minLength={6} className="form-input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? <div className="spinner" style={{ width: '1.2rem', height: '1.2rem' }} /> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};
