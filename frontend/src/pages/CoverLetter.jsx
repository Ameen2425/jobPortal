import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { aiService } from '../services/aiService';
import { jobService } from '../services/jobService';
import { PenTool, Copy, CheckCircle2, Sparkles, Download } from 'lucide-react';

export const CoverLetter = () => {
  const location = useLocation();
  const initialJobId = location.state?.jobId || '';

  const [jobId, setJobId] = useState(initialJobId);
  const [customNotes, setCustomNotes] = useState('');
  const [jobs, setJobs] = useState([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await jobService.getJobs({ page_size: 20 });
        setJobs(data.results || data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadJobs();
    if (initialJobId) {
      handleGenerate(initialJobId);
    }
  }, [initialJobId]);

  const handleGenerate = async (targetId = jobId) => {
    try {
      setLoading(true);
      const res = await aiService.generateCoverLetter(targetId, customNotes);
      setCoverLetter(res.cover_letter || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            AI Cover Letter Generator
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Generate a personalized, high-converting cover letter tailored to your profile and target job.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
            {/* Input Form */}
            <div className="card" style={{ background: 'white', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Generator Parameters</h3>

              <div className="form-group">
                <label className="form-label">Select Target Job</label>
                <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="form-select">
                  <option value="">Generic / Custom Application</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.company_details?.company_name})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Custom Context / Key Notes (Optional)</label>
                <textarea 
                  rows={4}
                  className="form-textarea"
                  placeholder="e.g. Highlight 3 years of Python Django experience and my passion for AI development..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                />
              </div>

              <button onClick={() => handleGenerate()} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                <Sparkles size={18} /> {loading ? 'Generating Cover Letter...' : 'Generate with AI'}
              </button>
            </div>

            {/* Generated Cover Letter Result */}
            <div className="card" style={{ background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Generated Cover Letter</h3>

                {coverLetter && (
                  <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                    {copied ? <CheckCircle2 size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="skeleton" style={{ height: '320px' }} />
              ) : coverLetter ? (
                <textarea 
                  rows={16}
                  className="form-textarea"
                  style={{ fontFamily: 'inherit', lineHeight: 1.6, fontSize: '0.925rem' }}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              ) : (
                <div className="empty-state" style={{ padding: '3rem 1rem' }}>
                  <PenTool size={36} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                    Select a position and click "Generate with AI" to create your customized cover letter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
