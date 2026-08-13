import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export const ResumeUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.toLowerCase().endswith?.('.pdf') && !selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF resume files are accepted.');
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const res = await authService.uploadResume(file);
      setMessage('Resume uploaded & parsed successfully!');
      if (onUploadSuccess) onUploadSuccess(res);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ border: '2px dashed var(--primary-200)', background: 'var(--primary-50)', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
      <div style={{
        width: '4rem',
        height: '4rem',
        borderRadius: '50%',
        background: 'white',
        color: 'var(--primary-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <UploadCloud size={32} />
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
        Upload Your Resume (PDF)
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
        Our AI Engine automatically extracts your skills, work experience, and calculates your ATS resume score.
      </p>

      <input 
        type="file" 
        id="resume-file-input" 
        accept=".pdf" 
        onChange={handleFileChange}
        style={{ display: 'none' }} 
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <label htmlFor="resume-file-input" className="btn btn-outline">
          <FileText size={18} /> {file ? file.name : 'Select PDF File'}
        </label>

        {file && (
          <button onClick={handleUpload} disabled={loading} className="btn btn-primary">
            {loading ? <div className="spinner" style={{ width: '1rem', height: '1rem' }} /> : 'Parse with AI'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {message && (
        <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} /> {message}
        </div>
      )}
    </div>
  );
};
