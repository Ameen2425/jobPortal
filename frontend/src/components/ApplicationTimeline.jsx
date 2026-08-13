import React from 'react';
import { CheckCircle2, Clock, Calendar, Check, XCircle } from 'lucide-react';

const STAGES = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'SELECTED', label: 'Selected' },
];

export const ApplicationTimeline = ({ currentStatus }) => {
  if (currentStatus === 'REJECTED') {
    return (
      <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <XCircle size={20} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Application Rejected</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Thank you for applying. The recruiter decided not to move forward at this time.</div>
        </div>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex(s => s.key === currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div style={{ padding: '1.25rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Progress Bar background line */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '10%',
          right: '10%',
          height: '3px',
          background: 'var(--slate-200)',
          zIndex: 1
        }}>
          <div style={{
            height: '100%',
            width: `${(activeIdx / (STAGES.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, var(--primary-600), var(--accent-cyan))',
            transition: 'width 300ms ease'
          }} />
        </div>

        {STAGES.map((stage, idx) => {
          const isDone = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          return (
            <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: isDone ? 'var(--primary-600)' : 'var(--surface-white)',
                border: `3px solid ${isDone ? 'var(--primary-600)' : 'var(--slate-300)'}`,
                color: isDone ? 'white' : 'var(--slate-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: isCurrent ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 250ms'
              }}>
                {isDone ? <Check size={16} /> : idx + 1}
              </div>
              <span style={{
                marginTop: '0.5rem',
                fontSize: '0.775rem',
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? 'var(--primary-700)' : isDone ? 'var(--slate-800)' : 'var(--slate-400)'
              }}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
