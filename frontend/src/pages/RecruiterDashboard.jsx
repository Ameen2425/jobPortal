import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Briefcase, Users, CheckCircle2, Calendar, PlusCircle, ArrowRight, Building } from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getRecruiterAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const funnelData = analytics?.funnel || [
    { stage: 'Applicants', count: 12 },
    { stage: 'Shortlisted', count: 5 },
    { stage: 'Interviews', count: 3 },
    { stage: 'Selected', count: 1 },
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          {/* Top Banner */}
          <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, var(--slate-900), var(--primary-900))', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Recruiter Portal — {user?.first_name || user?.username} 👋
                </h1>
                <p style={{ color: 'var(--slate-300)', fontSize: '0.925rem' }}>
                  Manage your active listings, candidate screening, and AI applicant rankings.
                </p>
              </div>

              <Link to="/recruiter/jobs/create" className="btn btn-primary btn-lg">
                <PlusCircle size={20} /> Post New Job
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.active_jobs || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Active Jobs</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.total_applicants || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Applicants</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.shortlisted || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Shortlisted</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.interviews || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Interviews</div>
              </div>
            </div>
          </div>

          {/* Hiring Funnel Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
            <div className="card" style={{ background: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Hiring Funnel Analytics</h3>
              <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                    <Bar dataKey="count" fill="var(--primary-600)" radius={[6, 6, 0, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--accent-emerald)' : 'var(--primary-600)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ background: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Quick Actions</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/recruiter/jobs" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                  <span>Manage Active Job Posts</span> <ArrowRight size={16} />
                </Link>
                <Link to="/recruiter/company" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                  <span>Update Company Details</span> <Building size={16} />
                </Link>
                <Link to="/recruiter/analytics" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                  <span>View Hiring Reports</span> <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
