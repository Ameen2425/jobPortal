import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { jobService } from '../services/jobService';
import { PlusCircle, Edit3, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getMyJobs();
      setJobs(data.results || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleStatusToggle = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'CLOSED' : 'PUBLISHED';
    try {
      await jobService.updateJob(jobId, { status: nextStatus });
      fetchMyJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        await jobService.deleteJob(jobId);
        fetchMyJobs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Manage Job Listings
              </h1>
              <p style={{ color: 'var(--slate-600)', margin: 0, fontSize: '0.9rem' }}>
                View and edit your posted positions and review candidate applications.
              </p>
            </div>

            <Link to="/recruiter/jobs/create" className="btn btn-primary">
              <PlusCircle size={18} /> Post New Job
            </Link>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: '300px' }} />
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No Jobs Created Yet</h3>
              <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>
                Create your first job listing to start receiving AI-matched applications.
              </p>
              <Link to="/recruiter/jobs/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Post Job
              </Link>
            </div>
          ) : (
            <div className="card" style={{ background: 'white', padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)' }}>
                    <th style={{ padding: '1rem' }}>Job Title</th>
                    <th style={{ padding: '1rem' }}>Type & Mode</th>
                    <th style={{ padding: '1rem' }}>Applicants</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                        <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontWeight: 400 }}>
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        {job.job_type?.replace('_', ' ')} • {job.work_mode}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-outline btn-sm" style={{ gap: '0.35rem' }}>
                          <Users size={14} /> {job.application_count || 0} Applicants
                        </Link>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: job.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: job.status === 'PUBLISHED' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                        }}>
                          {job.status}
                        </span>
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleStatusToggle(job.id, job.status)} 
                            className="btn btn-secondary btn-sm"
                            title="Toggle Publish Status"
                          >
                            {job.status === 'PUBLISHED' ? 'Close' : 'Publish'}
                          </button>

                          <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-secondary btn-sm">
                            <Edit3 size={14} />
                          </Link>

                          <button onClick={() => handleDelete(job.id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-rose)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
