import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { analyticsService } from '../services/analyticsService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, Users, CheckCircle2, Calendar } from 'lucide-react';

export const RecruiterAnalytics = () => {
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
    { stage: 'Applicants', count: 15 },
    { stage: 'Shortlisted', count: 6 },
    { stage: 'Interviews', count: 4 },
    { stage: 'Selected', count: 2 },
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            Hiring & Candidate Analytics
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Comprehensive performance metrics for active job postings and applicant conversion funnel.
          </p>

          {loading ? (
            <div className="skeleton" style={{ height: '300px' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="card" style={{ background: 'white' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recruitment Conversion Funnel</h3>
                <div style={{ height: '280px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData}>
                      <XAxis dataKey="stage" stroke="#94a3b8" fontSize={13} />
                      <YAxis stroke="#94a3b8" fontSize={13} allowDecimals={false} />
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
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
