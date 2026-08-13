import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { JobCard } from '../components/JobCard';
import { aiService } from '../services/aiService';
import { Sparkles, Cpu, Target } from 'lucide-react';

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await aiService.getRecommendations();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: 'var(--radius-md)' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                AI Job Recommendations
              </h1>
              <p style={{ color: 'var(--slate-600)', margin: 0, fontSize: '0.9rem' }}>
                Positions algorithmically calculated using TF-IDF text similarity and skill overlap weighting.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid-2" style={{ marginTop: '2rem' }}>
              {[1, 2, 3, 4].map(n => <div key={n} className="skeleton" style={{ height: '220px' }} />)}
            </div>
          ) : (
            <div className="grid-2" style={{ marginTop: '2rem' }}>
              {recommendations.map((rec, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  {/* AI Match Header Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '1rem',
                    background: 'linear-gradient(135deg, var(--primary-600), var(--accent-cyan))',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    zIndex: 10,
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    ✨ {rec.match_score}% AI Match
                  </div>
                  <JobCard job={rec.job} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
