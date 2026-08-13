import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ResumeUploader } from '../components/ResumeUploader';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { aiService } from '../services/aiService';

export const Resume = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = async () => {
    try {
      setLoading(true);
      const res = await aiService.analyzeResume();
      setAnalysis(res);
    } catch (err) {
      console.error("Resume analysis error", err);
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
            Resume Upload & ATS Intelligence
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Upload your PDF resume to generate an instant natural-language ATS score and technical recommendations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ResumeUploader onUploadSuccess={handleUploadSuccess} />

            {loading ? (
              <div className="skeleton" style={{ height: '300px' }} />
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
