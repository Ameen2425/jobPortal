import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { JobCard } from '../components/JobCard';
import { jobService } from '../services/jobService';
import { companyService } from '../services/companyService';
import { 
  Search, MapPin, Sparkles, Building, CheckCircle2, TrendingUp, Users, ArrowRight, ShieldCheck, Cpu 
} from 'lucide-react';

export const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsData = await jobService.getJobs({ page_size: 6 });
        setFeaturedJobs(jobsData.results || jobsData || []);
        const companiesData = await companyService.getCompanies({ page_size: 6 });
        setCompanies(companiesData.results || companiesData || []);
      } catch (err) {
        console.error("Home data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container-xl">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--primary-50)',
              color: 'var(--primary-700)',
              border: '1px solid var(--primary-200)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={16} /> AI-Powered Job Matching Engine v2.0
            </div>

            <h1 className="hero-title">
              Find the Right Job.<br />
              <span className="hero-title-gradient">Build the Right Career.</span>
            </h1>

            <p className="hero-subtitle">
              Next-generation AI job portal connecting top technical talent with industry leaders through real-time TF-IDF skill matching, resume ATS scoring, and candidate recommendations.
            </p>

            {/* SEARCH BOX */}
            <form onSubmit={handleSearch} style={{
              maxWidth: '840px',
              margin: '0 auto',
              background: 'white',
              padding: '0.65rem',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--slate-200)',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 2, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.75rem' }}>
                <Search size={20} color="var(--slate-400)" />
                <input 
                  type="text" 
                  placeholder="Job title, skills, or keywords (e.g. Python, React)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.75rem', borderLeft: '1px solid var(--slate-200)' }}>
                <MapPin size={20} color="var(--slate-400)" />
                <input 
                  type="text" 
                  placeholder="City or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '140px' }}>
                Find Jobs
              </button>
            </form>
          </div>
        </section>

        {/* AI FEATURES SHOWCASE */}
        <section style={{ padding: '4rem 0', background: 'white', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
          <div className="container-xl">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Powered by Intelligent Machine Learning
              </h2>
              <p style={{ color: 'var(--slate-600)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                Our backend NLP algorithms assist both job seekers and recruiters with precision match calculations.
              </p>
            </div>

            <div className="grid-3">
              <div className="card" style={{ background: 'var(--slate-50)' }}>
                <div style={{ width: '3rem', height: '3rem', background: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Cpu size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>TF-IDF Job Recommendation</h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Calculates Cosine Similarity score between candidate profile skills, bio, headline, and open job requirements.
                </p>
              </div>

              <div className="card" style={{ background: 'var(--slate-50)' }}>
                <div style={{ width: '3rem', height: '3rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Sparkles size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Automated Resume ATS Analyzer</h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Parses PDF resumes, evaluates keyword density, scores technical sections, and delivers actionable suggestions.
                </p>
              </div>

              <div className="card" style={{ background: 'var(--slate-50)' }}>
                <div style={{ width: '3rem', height: '3rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <TrendingUp size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Recruiter Candidate Matcher</h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Ranks applicants automatically by weighted match percentage to streamline recruiter candidate shortlisting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED JOBS GRID */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container-xl">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>Featured Opportunities</h2>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>Explore verified positions from top companies</p>
              </div>
              <Link to="/jobs" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                View All Jobs <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid-3">
                {[1, 2, 3].map((n) => <div key={n} className="skeleton" style={{ height: '220px' }} />)}
              </div>
            ) : (
              <div className="grid-3">
                {featuredJobs.slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STATS SECTION */}
        <section style={{ padding: '4rem 0', background: 'var(--slate-900)', color: 'white' }}>
          <div className="container-xl grid-4" style={{ textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--primary-400)', marginBottom: '0.25rem' }}>10,000+</div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.9rem', fontWeight: 600 }}>Active Job Postings</div>
            </div>
            <div>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>95%</div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.9rem', fontWeight: 600 }}>AI Match Accuracy</div>
            </div>
            <div>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--accent-emerald)', marginBottom: '0.25rem' }}>500+</div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.9rem', fontWeight: 600 }}>Verified Companies</div>
            </div>
            <div>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--accent-amber)', marginBottom: '0.25rem' }}>24/7</div>
              <div style={{ color: 'var(--slate-400)', fontSize: '0.9rem', fontWeight: 600 }}>Automated Screening</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
