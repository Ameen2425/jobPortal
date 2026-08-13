import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { JobCard } from '../components/JobCard';
import { companyService } from '../services/companyService';
import { jobService } from '../services/jobService';
import { Building, MapPin, Globe, Users, Calendar } from 'lucide-react';

export const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const comp = await companyService.getCompanyById(id);
        setCompany(comp);
        const jobsData = await jobService.getJobs({ company: id });
        setCompanyJobs(jobsData.results || jobsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="container-xl" style={{ padding: '4rem 0' }}><div className="spinner" /></div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="container-xl empty-state" style={{ margin: '4rem auto' }}>
          <h2>Company Not Found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '2.5rem 0' }}>
        <div className="container-xl">
          {/* Header Card */}
          <div className="card" style={{ marginBottom: '2rem', background: 'white' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div className="company-logo-badge" style={{ width: '5rem', height: '5rem', fontSize: '2rem' }}>
                {company.company_name?.[0] || 'C'}
              </div>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>{company.company_name}</h1>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--slate-600)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  <span><Building size={16} /> {company.industry}</span>
                  <span>•</span>
                  <span><MapPin size={16} /> {company.location}</span>
                  <span>•</span>
                  <span><Users size={16} /> {company.company_size}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
            <div>
              <div className="card" style={{ background: 'white', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>About {company.company_name}</h3>
                <p style={{ color: 'var(--slate-700)', lineHeight: 1.7 }}>{company.description || 'No description available.'}</p>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>Active Positions</h2>
              {companyJobs.length === 0 ? (
                <div className="empty-state">No open positions at this time.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {companyJobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              )}
            </div>

            <div className="card" style={{ background: 'white', height: 'fit-content' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Company Overview</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                    <Globe size={16} /> Visit Website
                  </a>
                )}
                <div><strong>Founded:</strong> {company.founded_year || 'N/A'}</div>
                <div><strong>Total Jobs:</strong> {companyJobs.length}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
