import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { ResumeUploader } from '../components/ResumeUploader';
import { aiService } from '../services/aiService';

export const ResumeAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const res = await aiService.analyzeResume();
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            AI Resume & ATS Score Analyzer
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Comprehensive analysis of technical keywords, formatting, sections, and recruiter ATS compatibility.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ResumeUploader onUploadSuccess={fetchAnalysis} />

            {loading ? (
              <div className="skeleton" style={{ height: '320px' }} />
            ) : (
              analysis && <AIAnalysisCard analysis={analysis} />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
