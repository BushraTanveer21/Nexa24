import React, { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import './TestimonialPage.css';
import branchTL from "../assets/botanical-branch-tl.png";

export default function TestimonialPage() {

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/api/testimonials`);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        const activeTestimonials = data.filter(t => t.isEnabled !== false);
        setTestimonials(activeTestimonials);
      } catch (err) {
        // Silently catch the error on Vercel and just show the empty state instead of crashing
        setTestimonials([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="main-wrapper">
      {/* Background Decorative Botanical Leaves */}
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-tl" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-br" />

      <section className="hero-wrap">
        <div className="hero-inner" style={{ justifyContent: 'center' }}>
        <div className="hero-content reveal" style={{ margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow" style={{ display: 'inline-flex', marginBottom: '24px', justifyContent: 'center' }}>
            <span className="dot" />
            CLIENT STORIES
          </span>
          <h1>
            Hear from our <span>partners.</span>
          </h1>
          <p>
            Discover how NEXA24 is transforming healthcare management and empowering practices across the globe.
          </p>
        </div>
        </div>
      </section>

      <section className="testimonial-grid-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error loading testimonials. Please try again later.</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="empty-state">
            <p>No testimonials available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <Tilt key={t._id} tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="testimonial-card-wrapper">
                  <div className="testimonial-card">
                    <div className="quote-icon">"</div>
                    <p className="testimonial-content">{t.message}</p>
                    <div className="testimonial-author">
                      <h4>{t.name}</h4>
                      <p className="author-role">{t.position}</p>
                    </div>
                  </div>
              </Tilt>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
