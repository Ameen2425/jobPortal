import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { JobCard } from '../components/JobCard';
import { jobService } from '../services/jobService';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

export const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [ordering, setOrdering] = useState('newest');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        location: location || undefined,
        job_type: jobType || undefined,
        work_mode: workMode || undefined,
        experience_level: experienceLevel || undefined,
        ordering: ordering
      };
      const data = await jobService.getJobs(params);
      setJobs(data.results || data || []);
      setTotalCount(data.count || (data.results ? data.results.length : 0));
    } catch (err) {
      console.error("Fetch jobs error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType, workMode, experienceLevel, ordering]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setWorkMode('');
    setExperienceLevel('');
    setOrdering('newest');
    fetchJobs();
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '2rem 0' }}>
        <div className="container-xl">
          {/* Top Search Banner */}
          <div className="card" style={{ marginBottom: '2rem', background: 'var(--surface-white)' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--slate-50)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)' }}>
                  <Search size={18} color="var(--slate-400)" />
                  <input 
                    type="text" 
                    placeholder="Search title or skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--slate-50)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)' }}>
                  <MapPin size={18} color="var(--slate-400)" />
                  <input 
                    type="text" 
                    placeholder="Location or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
                  />
                </div>
              </div>

              <select 
                value={ordering} 
                onChange={(e) => setOrdering(e.target.value)}
                className="form-select"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="salary_low">Salary: Low to High</option>
              </select>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Search</button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Filter Sidebar */}
              <aside className="card" style={{ height: 'fit-content', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Filter size={18} /> Filters
                  </h3>
                  <button onClick={handleReset} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Work Mode</label>
                  <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="form-select">
                    <option value="">All Work Modes</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ON_SITE">On-Site</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="form-select">
                    <option value="">All Job Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Experience Level</label>
                  <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="form-select">
                    <option value="">All Experience Levels</option>
                    <option value="ENTRY_LEVEL">Entry Level</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID_LEVEL">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                  </select>
                </div>
              </aside>

              {/* Jobs List */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 600 }}>
                  Showing {totalCount} open positions
                </div>

                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: '180px' }} />)}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="empty-state">
                    <h3>No matching jobs found</h3>
                    <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>Try broadening your search query or resetting filters.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {jobs.map(job => <JobCard key={job.id} job={job} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
