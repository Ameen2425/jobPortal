import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { jobService } from '../services/jobService';
import { Save } from 'lucide-react';

export const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [experienceLevel, setExperienceLevel] = useState('MID_LEVEL');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState('PUBLISHED');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobById(id);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setResponsibilities(data.responsibilities || '');
        setRequirements(data.requirements || '');
        setLocation(data.location || '');
        setJobType(data.job_type || 'FULL_TIME');
        setWorkMode(data.work_mode || 'HYBRID');
        setExperienceLevel(data.experience_level || 'MID_LEVEL');
        setSalaryMin(data.salary_min || '');
        setSalaryMax(data.salary_max || '');
        setSkills(data.skills || '');
        setStatus(data.status || 'PUBLISHED');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await jobService.updateJob(id, {
        title,
        description,
        responsibilities,
        requirements,
        location,
        job_type: jobType,
        work_mode: workMode,
        experience_level: experienceLevel,
        salary_min: salaryMin ? parseFloat(salaryMin) : null,
        salary_max: salaryMax ? parseFloat(salaryMax) : null,
        skills,
        status
      });
      navigate('/recruiter/jobs');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            Edit Job Post
          </h1>

          {loading ? (
            <div className="skeleton" style={{ height: '300px' }} />
          ) : (
            <div className="card" style={{ background: 'white', maxWidth: '840px' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" required className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                    <label className="form-label">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills</label>
                  <input type="text" required className="form-input" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea rows={5} required className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Update Job'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
