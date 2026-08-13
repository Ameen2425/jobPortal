import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { JobCard } from '../components/JobCard';
import { jobService } from '../services/jobService';
import { Link } from 'react-router-dom';

export const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const data = await jobService.getSavedJobs();
        setSavedJobs(data.results || data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleSaveToggle = (jobId) => {
    setSavedJobs(prev => prev.filter(item => item.job?.id !== jobId));
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            Saved Jobs
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Bookmarked positions you are interested in applying for.
          </p>

          {loading ? (
            <div className="grid-2">
              {[1, 2].map(n => <div key={n} className="skeleton" style={{ height: '200px' }} />)}
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="empty-state">
              <h3>No Saved Jobs Yet</h3>
              <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>
                Start exploring jobs and save the ones you want to review later.
              </p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
            </div>
          ) : (
            <div className="grid-2">
              {savedJobs.map(item => (
                <JobCard key={item.id} job={item.job} onSaveToggle={handleSaveToggle} />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
