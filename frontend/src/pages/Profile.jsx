import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { User, Plus, Trash2, CheckCircle2, Save } from 'lucide-react';

export const Profile = () => {
  const { user, refreshProfile } = useAuth();

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Skills
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('INTERMEDIATE');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (user?.profile) {
      setHeadline(user.profile.headline || '');
      setBio(user.profile.bio || '');
      setLocation(user.profile.location || '');
      setGithubUrl(user.profile.github_url || '');
      setLinkedinUrl(user.profile.linkedin_url || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg(null);
      await authService.updateProfile({
        profile: {
          headline,
          bio,
          location,
          github_url: githubUrl,
          linkedin_url: linkedinUrl
        }
      });
      await refreshProfile();
      setMsg('Profile updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      await authService.addSkill({ skill_name: newSkillName.trim(), skill_level: newSkillLevel });
      setNewSkillName('');
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await authService.deleteSkill(id);
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
            Manage Candidate Profile
          </h1>

          {msg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {msg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Main Form */}
            <div className="card" style={{ background: 'white' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Personal & Professional Info</h3>

              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">Professional Headline</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Senior Full Stack Python & React Engineer"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Hyderabad, India or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Bio & Summary</label>
                  <textarea 
                    rows={5}
                    className="form-textarea" 
                    placeholder="Brief overview of your experience, key achievements, and passion..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://github.com/username"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Skills Sidebar Widget */}
            <div className="card" style={{ background: 'white', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Skills</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Add skill (e.g. Python, Docker)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select 
                    value={newSkillLevel} 
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="form-select" 
                    style={{ flex: 1 }}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                  <button type="button" onClick={handleAddSkill} className="btn btn-primary btn-sm">
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(user?.profile?.skills || []).map((skill) => (
                  <div key={skill.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{skill.skill_name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginLeft: '0.5rem' }}>({skill.skill_level})</span>
                    </div>
                    <button onClick={() => handleDeleteSkill(skill.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
