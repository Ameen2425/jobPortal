import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { jobService } from '../services/jobService';
import { PlusCircle, Save } from 'lucide-react';

export const CreateJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [experienceLevel, setExperienceLevel] = useState('MID_LEVEL');
  const [salaryMin, setSalaryMin] = useState('800000');
  const [salaryMax, setSalaryMax] = useState('1500000');
  const [skills, setSkills] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('PUBLISHED');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await jobService.createJob({
        title,
        description,
        responsibilities,
        requirements,
        location,
        job_type: jobType,
        work_mode: workMode,
        experience_level: experienceLevel,
        salary_min: parseFloat(salaryMin),
        salary_max: parseFloat(salaryMax),
        skills,
        deadline: deadline || null,
        status
      });
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            Post a New Job
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Fill out the details below. Our AI engine will automatically match eligible candidates.
          </p>

          <div className="card" style={{ background: 'white', maxWidth: '840px' }}>
            {error && (
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input type="text" required className="form-input" placeholder="e.g. Senior Full Stack Python Developer" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="form-select">
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Work Mode</label>
                  <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="form-select">
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ON_SITE">On-Site</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="form-select">
                    <option value="ENTRY_LEVEL">Entry Level</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID_LEVEL">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Min Salary (Annual ₹)</label>
                  <input type="number" className="form-input" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Salary (Annual ₹)</label>
                  <input type="number" className="form-input" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" required className="form-input" placeholder="Hyderabad, India or Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (Comma separated) *</label>
                <input type="text" required className="form-input" placeholder="Python, Django, React, MySQL, Git, REST APIs" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea rows={5} required className="form-textarea" placeholder="Detailed position summary..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Key Responsibilities</label>
                <textarea rows={4} className="form-textarea" placeholder="• Design REST APIs..." value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements & Qualifications</label>
                <textarea rows={4} className="form-textarea" placeholder="• 3+ years experience in Python..." value={requirements} onChange={(e) => setRequirements(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => navigate('/recruiter/jobs')} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  <Save size={16} /> {loading ? 'Publishing...' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
