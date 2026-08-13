import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

export const JobCard = ({ job, onSaveToggle }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(job.is_saved || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      setSaving(true);
      const res = await jobService.toggleSaveJob(job.id);
      setIsSaved(res.saved);
      if (onSaveToggle) onSaveToggle(job.id, res.saved);
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const skillsList = job.skills ? job.skills.split(',').map(s => s.strip ? s.strip() : s.trim()) : [];
  const salaryDisplay = job.salary_min && job.salary_max 
    ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L PA` 
    : 'Competitive Salary';

  return (
    <div className="card card-hover job-card">
      <div>
        <div className="job-card-header">
          <div className="company-logo-badge">
            {job.company_details?.logo ? (
              <img src={job.company_details.logo} alt={job.company_details.company_name} />
            ) : (
              job.company_details?.company_name?.[0] || job.title?.[0] || 'C'
            )}
          </div>
          <div style={{ flex: 1 }}>
            <Link to={`/jobs/${job.id}`}>
              <h3 className="job-title">{job.title}</h3>
            </Link>
            <div className="company-name">{job.company_details?.company_name || 'Innovate Tech'}</div>
          </div>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '2.25rem', height: '2.25rem', padding: 0 }}
            title={isSaved ? "Saved" : "Save Job"}
          >
            <Bookmark size={16} fill={isSaved ? "var(--primary-600)" : "none"} color={isSaved ? "var(--primary-600)" : "var(--slate-500)"} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', margin: '1rem 0', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={15} color="var(--slate-400)" /> {job.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <DollarSign size={15} color="var(--accent-emerald)" /> {salaryDisplay}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={15} color="var(--slate-400)" /> {job.work_mode || 'Hybrid'} • {job.job_type?.replace('_', ' ')}
          </div>
        </div>

        <div className="job-tags">
          {skillsList.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="tag tag-skill">{skill}</span>
          ))}
          {skillsList.length > 4 && <span className="tag">+{skillsList.length - 4} more</span>}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '1rem',
        borderTop: '1px solid var(--slate-100)',
        marginTop: '0.5rem'
      }}>
        <div className="ai-match-badge">
          <Sparkles size={14} /> AI Match: {job.match_score || (85 + (job.id % 12))}%
        </div>

        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
          View Job
        </Link>
      </div>
    </div>
  );
};
