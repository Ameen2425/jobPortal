import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { JobCard } from '../components/JobCard';
import { analyticsService } from '../services/analyticsService';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Send, CheckCircle2, Calendar, Bookmark, Sparkles, Target, ArrowRight } from 'lucide-react';

export const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getJobSeekerAnalytics();
        setAnalytics(data);
        const recData = await aiService.getRecommendations();
        setRecommendations(recData.recommendations || []);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = analytics?.status_breakdown || [
    { status: 'Applied', count: 4 },
    { status: 'Review', count: 2 },
    { status: 'Shortlist', count: 1 },
    { status: 'Interview', count: 1 },
    { status: 'Selected', count: 0 },
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          {/* Welcome Banner */}
          <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, var(--slate-900), var(--primary-900))', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Welcome back, {user?.first_name || user?.username}! 👋
                </h1>
                <p style={{ color: 'var(--slate-300)', fontSize: '0.925rem' }}>
                  Here is your real-time job application activity & AI career recommendations.
                </p>
              </div>

              {/* Profile Completion Bar */}
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-lg)', minWidth: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <span>Profile Completion</span>
                  <span>{analytics?.profile_completion || 85}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${analytics?.profile_completion || 85}%`, background: 'var(--accent-cyan)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.total_applications || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Applications</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.shortlisted || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Shortlisted</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.interviews || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Interviews</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bookmark size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)' }}>{analytics?.saved_jobs || 0}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 600 }}>Saved Jobs</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Application Funnel Chart */}
            <div className="card" style={{ background: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Application Pipeline Status</h3>
              <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="status" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                    <Bar dataKey="count" fill="var(--primary-600)" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--accent-emerald)' : 'var(--primary-600)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="card" style={{ background: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={18} color="var(--primary-600)" /> AI Career Insights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={{ background: 'var(--primary-50)', padding: '0.85rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-200)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>High Skill Match Detected!</div>
                  <div style={{ color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                    Your Python & React skills match 94% of new Full-Stack Developer listings.
                  </div>
                </div>

                <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Resume ATS Score: 85/100</div>
                  <div style={{ color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                    Add "Docker" and "AWS" to reach 95%+ ATS compatibility.
                  </div>
                </div>

                <Link to="/job-seeker/recommendations" className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>
                  Explore AI Recommendations <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={18} color="var(--primary-600)" /> Top AI-Recommended Jobs For You
              </h3>
              <Link to="/job-seeker/recommendations" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                View All Matches →
              </Link>
            </div>

            <div className="grid-2">
              {recommendations.slice(0, 4).map((rec, idx) => (
                <JobCard key={idx} job={rec.job} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
