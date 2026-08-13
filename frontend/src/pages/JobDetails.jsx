import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { 
  Building, MapPin, DollarSign, Briefcase, Calendar, Bookmark, Send, Sparkles, CheckCircle2, AlertCircle, Share2, PenTool 
} from 'lucide-react';

export const JobDetails = () => {
  const { id } = useParams();
  const { user, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobById(id);
        setJob(data);
        setIsSaved(data.is_saved || false);
      } catch (err) {
        console.error("Job details error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await jobService.toggleSaveJob(job.id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setApplying(true);
      setApplyError(null);
      await applicationService.applyForJob(job.id, coverLetter, resumeFile);
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setJob(prev => ({ ...prev, has_applied: true }));
      }, 1500);
    } catch (err) {
      setApplyError(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="container-xl" style={{ padding: '4rem 0' }}><div className="spinner" /></div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="container-xl empty-state" style={{ margin: '4rem auto' }}>
          <h2>Job Not Found</h2>
          <p>The job posting you are looking for does not exist or has been removed.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse All Jobs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const skillsList = job.skills ? job.skills.split(',').map(s => s.trim()) : [];

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '2.5rem 0' }}>
        <div className="container-xl">
          {/* Top Header Card */}
          <div className="card" style={{ marginBottom: '2rem', background: 'var(--surface-white)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div className="company-logo-badge" style={{ width: '4.5rem', height: '4.5rem', fontSize: '1.75rem' }}>
                  {job.company_details?.company_name?.[0] || 'C'}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                    {job.title}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--slate-600)', fontSize: '0.95rem', fontWeight: 500 }}>
                    <span style={{ color: 'var(--primary-600)', fontWeight: 700 }}>{job.company_details?.company_name}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={16} /> {job.location}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleToggleSave} className="btn btn-secondary">
                  <Bookmark size={18} fill={isSaved ? "var(--primary-600)" : "none"} color={isSaved ? "var(--primary-600)" : "currentColor"} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                {job.has_applied ? (
                  <button disabled className="btn btn-secondary" style={{ background: 'var(--accent-emerald)', color: 'white' }}>
                    <CheckCircle2 size={18} /> Applied
                  </button>
                ) : (
                  <button onClick={() => setShowApplyModal(true)} className="btn btn-primary btn-lg">
                    <Send size={18} /> Apply Now
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metadata Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--slate-100)',
              background: 'var(--slate-50)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Salary Offered</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  ₹{(job.salary_min / 100000).toFixed(1)}L - ₹{(job.salary_max / 100000).toFixed(1)}L PA
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Job Type & Mode</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {job.job_type?.replace('_', ' ')} • {job.work_mode}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Experience Level</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {job.experience_level?.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>AI Candidate Match</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={16} /> 94% Match
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
            {/* Main Details */}
            <div className="card" style={{ background: 'white' }}>
              <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>Job Description</h3>
                <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{job.description}</p>
              </section>

              {job.responsibilities && (
                <section style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>Key Responsibilities</h3>
                  <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{job.responsibilities}</p>
                </section>
              )}

              {job.requirements && (
                <section style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>Requirements & Qualifications</h3>
                  <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{job.requirements}</p>
                </section>
              )}

              <section>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>Required Tech Stack & Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="tag tag-skill" style={{ fontSize: '0.875rem', padding: '0.4rem 0.85rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar Tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* AI Tools Widget */}
              <div className="card" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={18} color="var(--primary-600)" /> HireAI Career Assistant
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Generate a custom AI cover letter or evaluate your skill gaps for this specific position.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/job-seeker/cover-letter" state={{ jobId: job.id, jobTitle: job.title, companyName: job.company_details?.company_name }} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <PenTool size={16} /> AI Cover Letter Tool
                  </Link>
                  <Link to="/job-seeker/skill-gap" state={{ jobId: job.id, jobSkills: job.skills }} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Skill-Gap Assessment
                  </Link>
                </div>
              </div>

              {/* Company Overview Card */}
              <div className="card" style={{ background: 'white' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>About Company</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {job.company_details?.description || 'Leading tech company building innovative SaaS products.'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div><strong>Industry:</strong> {job.company_details?.industry || 'Technology'}</div>
                  <div><strong>Company Size:</strong> {job.company_details?.company_size || '50-200 employees'}</div>
                  <div><strong>Location:</strong> {job.company_details?.location || job.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Apply for {job.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Submitting application to {job.company_details?.company_name}
            </p>

            {applySuccess ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-emerald)' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 1rem' }} />
                <h3>Application Submitted!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginTop: '0.5rem' }}>
                  The recruiter will review your profile. You will receive notifications on status updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply}>
                {applyError && (
                  <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {applyError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Cover Letter (Optional)</label>
                  <textarea 
                    rows={6}
                    className="form-textarea"
                    placeholder="Tell the hiring manager why you are a great fit..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attach Custom Resume PDF (Optional)</label>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={applying} className="btn btn-primary">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
