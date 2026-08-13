import React from 'react';
import { Target, CheckCircle, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

export const AIAnalysisCard = ({ analysis }) => {
  if (!analysis) return null;

  const score = analysis.score || 82;

  const getScoreColor = (val) => {
    if (val >= 80) return 'var(--accent-emerald)';
    if (val >= 60) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  return (
    <div className="card" style={{ background: 'var(--surface-white)', borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap color="var(--primary-600)" size={22} /> AI Resume ATS Report
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: 0 }}>Automated natural language resume evaluation</p>
        </div>

        {/* Radial Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--slate-50)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: getScoreColor(score) }}>
            {score}<span style={{ fontSize: '1rem', color: 'var(--slate-400)' }}>/100</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: getScoreColor(score) }}>
            {score >= 80 ? 'Excellent ATS' : score >= 60 ? 'Good Match' : 'Needs Optimization'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Strengths */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle size={18} /> Strengths
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--slate-700)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(analysis.strengths || []).map((str, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ color: 'var(--accent-emerald)' }}>✓</span> {str}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Improvements */}
        <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={18} /> Areas for Improvement
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--slate-700)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(analysis.weaknesses || []).map((w, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ color: 'var(--accent-amber)' }}>•</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div style={{ background: 'var(--primary-50)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-200)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-700)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Lightbulb size={18} /> AI Recommendations
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
          {(analysis.suggestions || []).map((sug, idx) => (
            <div key={idx} style={{ background: 'white', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
              👉 {sug}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
