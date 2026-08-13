import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { companyService } from '../services/companyService';
import { Building, Save, CheckCircle2 } from 'lucide-react';

export const CompanyManagement = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('11-50 employees');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [foundedYear, setFoundedYear] = useState('2020');
  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await companyService.getMyCompany();
        if (data) {
          setCompanyName(data.company_name || '');
          setIndustry(data.industry || '');
          setCompanySize(data.company_size || '11-50 employees');
          setWebsite(data.website || '');
          setLocation(data.location || '');
          setFoundedYear(data.founded_year || '2020');
          setDescription(data.description || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompany();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg(null);
      await companyService.updateMyCompany({
        company_name: companyName,
        industry,
        company_size: companySize,
        website,
        location,
        founded_year: foundedYear ? parseInt(foundedYear) : null,
        description
      });
      setMsg('Company details updated successfully!');
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
            Company Profile Settings
          </h1>
          <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
            Manage your employer profile visible on job details and company directory pages.
          </p>

          {msg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {msg}
            </div>
          )}

          <div className="card" style={{ background: 'white', maxWidth: '780px' }}>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" required className="form-input" placeholder="Acme Technologies" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input type="text" className="form-input" placeholder="Information Technology" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Size</label>
                  <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} className="form-select">
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input type="url" className="form-input" placeholder="https://company.example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Headquarters Location</label>
                  <input type="text" className="form-input" placeholder="Hyderabad, India" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea rows={5} className="form-textarea" placeholder="Tell candidates about your company mission and culture..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Company Details'}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
