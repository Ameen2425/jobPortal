import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { aiService } from '../services/aiService';
import { applicationService } from '../services/applicationService';
import { Sparkles, CheckCircle2, XCircle, Calendar, User, FileText, Mail } from 'lucide-react';

export const ApplicantList = () => {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interview Modal
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('14:00');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/hireai-demo');
  const [notes, setNotes] = useState('Technical Screening Round');
  const [scheduling, setScheduling] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const data = await aiService.matchCandidates(id);
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      await applicationService.updateStatus(appId, status);
      fetchApplicants();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedAppId) return;
    try {
      setScheduling(true);
      await applicationService.scheduleInterview({
        application: selectedAppId,
        interview_date: interviewDate,
        interview_time: interviewTime,
        meeting_link: meetingLink,
        notes: notes
      });
      setSelectedAppId(null);
      fetchApplicants();
    } catch (err) {
      console.error(err);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Applicant Screening & AI Candidate Matcher
              </h1>
              <p style={{ color: 'var(--slate-600)', margin: 0, fontSize: '0.9rem' }}>
                Candidates ranked algorithmically by weighted skill, experience, and education match scores.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: '300px' }} />
          ) : candidates.length === 0 ? (
            <div className="empty-state">
              <h3>No Applicants Yet</h3>
              <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>
                Applications for this job listing will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {candidates.map((cand) => (
                <div key={cand.candidate_id} className="card" style={{ background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        background: 'var(--primary-100)',
                        color: 'var(--primary-700)',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {cand.candidate_name?.[0] || 'C'}
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                          {cand.candidate_name}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={14} /> {cand.candidate_email}</span>
                          {cand.application_status && (
                            <span className="tag" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 700 }}>
                              Status: {cand.application_status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI Match Badge */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.12))',
                      border: '1px solid var(--primary-200)',
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-xl)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Sparkles size={20} /> {cand.ai_match_score}%
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>AI Match Score</div>
                    </div>
                  </div>

                  {/* Score Breakdown Bar */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginTop: '1.25rem',
                    padding: '0.85rem 1rem',
                    background: 'var(--slate-50)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.85rem'
                  }}>
                    <div><strong>Skills Match:</strong> {cand.skills_match}%</div>
                    <div><strong>Experience Match:</strong> {cand.experience_match}%</div>
                    <div><strong>Education Match:</strong> {cand.education_match}%</div>
                  </div>

                  {/* Recruiter Action Buttons */}
                  {cand.application_id && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleStatusUpdate(cand.application_id, 'SHORTLISTED')} 
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)' }}
                      >
                        <CheckCircle2 size={16} /> Shortlist
                      </button>

                      <button 
                        onClick={() => setSelectedAppId(cand.application_id)} 
                        className="btn btn-primary btn-sm"
                      >
                        <Calendar size={16} /> Schedule Interview
                      </button>

                      <button 
                        onClick={() => handleStatusUpdate(cand.application_id, 'REJECTED')} 
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {selectedAppId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Schedule Candidate Interview
            </h3>

            <form onSubmit={handleScheduleInterview}>
              <div className="form-group">
                <label className="form-label">Interview Date *</label>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={interviewDate} 
                  onChange={(e) => setInterviewDate(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interview Time *</label>
                <input 
                  type="time" 
                  required 
                  className="form-input" 
                  value={interviewTime} 
                  onChange={(e) => setInterviewTime(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Meeting Link (Google Meet / Zoom) *</label>
                <input 
                  type="url" 
                  required 
                  className="form-input" 
                  value={meetingLink} 
                  onChange={(e) => setMeetingLink(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes for Candidate</label>
                <textarea 
                  rows={3} 
                  className="form-textarea" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setSelectedAppId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={scheduling} className="btn btn-primary">
                  {scheduling ? 'Scheduling...' : 'Confirm & Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
