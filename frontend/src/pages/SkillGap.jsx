import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { aiService } from '../services/aiService';
import { jobService } from '../services/jobService';
import { Target, CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react';

export const SkillGap = () => {
  const location = useLocation();
  const initialJobId = location.state?.jobId || '';
  const initialSkills = location.state?.jobSkills || '';

  const [jobId, setJobId] = useState(initialJobId);
  const [targetSkills, setTargetSkills] = useState(initialSkills || 'Python, Django, React, MySQL, Docker, AWS, REST APIs');
  const [jobs, setJobs] = useState([]);
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    handleAnalyze();
  }, []);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const res = await aiService.analyzeSkillGap(jobId, targetSkills);
      setGapData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (e) => {
    const selectedId = e.target.value;
    setJobId(selectedId);
    const selectedJob = jobs.find(j => String(j.id) === String(selectedId));
    if (selectedJob) {
      setTargetSkills(selectedJob.skills);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            AI Skill-Gap Analyzer
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Compare your profile skills against target job requirements to identify missing technologies and learning steps.
          </p>

          <div className="card" style={{ marginBottom: '2rem', background: 'white' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Select Target Job or Skills</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Select Job Position</label>
                <select value={jobId} onChange={handleJobSelect} className="form-select">
                  <option value="">Custom Skills Input</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.company_details?.company_name})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Target Required Skills (comma separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={targetSkills} 
                  onChange={(e) => setTargetSkills(e.target.value)} 
                />
              </div>

              <button onClick={handleAnalyze} disabled={loading} className="btn btn-primary">
                {loading ? 'Analyzing...' : 'Analyze Gap'}
              </button>
            </div>
          </div>

          {gapData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Readiness Card */}
              <div className="card" style={{ background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Skill Readiness Score</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', margin: 0 }}>
                      Match percentage for {gapData.job_title ? `${gapData.job_title} at ${gapData.company_name}` : 'Target Position'}
                    </p>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-600)' }}>
                    {gapData.readiness_percentage}%
                  </div>
                </div>

                <div style={{ height: '12px', background: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${gapData.readiness_percentage}%`, background: 'linear-gradient(90deg, var(--primary-600), var(--accent-cyan))' }} />
                </div>
              </div>

              {/* Matched vs Missing Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={18} /> Skills You Have ({gapData.matched_skills?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(gapData.matched_skills || []).map((sk, idx) => (
                      <span key={idx} className="tag" style={{ background: 'white', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 }}>
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <XCircle size={18} /> Missing Skills ({gapData.missing_skills?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(gapData.missing_skills || []).map((sk, idx) => (
                      <span key={idx} className="tag" style={{ background: 'white', color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.3)', fontWeight: 600 }}>
                        ✕ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="card" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lightbulb size={18} /> Recommended Upskilling Plan
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(gapData.recommended_skills || []).map((sk, idx) => (
                    <span key={idx} className="tag" style={{ background: 'white', color: 'var(--primary-700)', fontWeight: 700, padding: '0.5rem 0.85rem' }}>
                      🚀 Learn {sk}
                    </span>
                  ))}
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
