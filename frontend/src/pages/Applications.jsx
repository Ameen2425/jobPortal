import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ApplicationTimeline } from '../components/ApplicationTimeline';
import { applicationService } from '../services/applicationService';
import { MapPin, Building, Calendar, ArrowUpRight } from 'lucide-react';

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getMyApplications();
        setApplications(data.results || data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            My Job Applications
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Track the status timeline of your submitted job applications.
          </p>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: '160px' }} />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <h3>No Applications Submitted Yet</h3>
              <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>Find your next opportunity and apply today.</p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {applications.map((app) => (
                <div key={app.id} className="card" style={{ background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <Link to={`/jobs/${app.job_details?.id}`}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                          {app.job_details?.title}
                        </h3>
                      </Link>
                      <div style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        {app.job_details?.company_details?.company_name} • {app.job_details?.location}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </div>

                  <ApplicationTimeline currentStatus={app.status} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
