import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { analyticsService } from '../services/analyticsService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { ShieldCheck, Users, Building, Briefcase, Send, Calendar } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAdminAnalytics();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const chartData = stats?.user_growth || [
    { name: 'Job Seekers', value: stats?.job_seekers || 20 },
    { name: 'Recruiters', value: stats?.recruiters || 5 },
    { name: 'Companies', value: stats?.companies || 10 },
  ];

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '2.5rem 0', background: 'var(--slate-50)' }}>
        <div className="container-xl">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--slate-900)', color: 'white', borderRadius: 'var(--radius-md)' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                HireAI Super Admin Control Center
              </h1>
              <p style={{ color: 'var(--slate-600)', margin: 0, fontSize: '0.9rem' }}>
                System-wide platform analytics, user role management, and content oversight.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: '300px' }} />
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid-4" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats?.total_users || 0}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Platform Users</div>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats?.companies || 0}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Companies</div>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats?.jobs || 0}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Jobs Created</div>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats?.applications || 0}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Applications</div>
                  </div>
                </div>
              </div>

              {/* System Breakdown Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ background: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Platform Entity Distribution</h3>
                  <div style={{ height: '260px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                        <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                        <Bar dataKey="value" fill="var(--primary-600)" radius={[6, 6, 0, 0]}>
                          <Cell fill="var(--primary-600)" />
                          <Cell fill="var(--accent-cyan)" />
                          <Cell fill="var(--accent-emerald)" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card" style={{ background: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>System Status</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--slate-100)' }}>
                      <span>Database Engine</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>MySQL 8.0 (InnoDB)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--slate-100)' }}>
                      <span>AI Model Service</span>
                      <strong style={{ color: 'var(--primary-600)' }}>TF-IDF + Cosine NLP</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--slate-100)' }}>
                      <span>Auth Engine</span>
                      <strong>Django REST + SimpleJWT</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0' }}>
                      <span>Active Interviews</span>
                      <strong>{stats?.interviews || 0} Scheduled</strong>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
