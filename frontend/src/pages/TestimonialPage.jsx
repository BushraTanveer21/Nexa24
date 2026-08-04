import React, { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import './TestimonialPage.css';

export default function TestimonialPage() {

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/testimonials');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data);
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
    <div className="testimonial-page-wrapper">
      {/* Decorative leaf branch top-left */}
      <img 
        src="/image.png?v=4" 
        alt="Decorative leaf branch" 
        style={{ 
          position: 'absolute', 
          top: '120px', 
          left: -20,
          opacity: 0.7,
          pointerEvents: 'none',
          zIndex: 1,
          width: '250px',
          maxWidth: '30vw'
        }} 
      />
      {/* Decorative leaf branch bottom-right */}
      <img 
        src="/image.png?v=4" 
        alt="Decorative leaf branch" 
        style={{ 
          position: 'absolute', 
          bottom: -20,
          right: -20,
          opacity: 0.7,
          pointerEvents: 'none',
          zIndex: 1,
          width: '250px',
          maxWidth: '30vw',
          transform: 'rotate(180deg)'
        }} 
      />

      <section className="testimonial-hero">
        <div className="testimonial-hero-content">
          <div className="eyebrow-exact">CLIENT STORIES</div>
          <h1 className="hero-title-exact">
            Hear from our <span className="purple-text">partners.</span>
          </h1>
          <p className="hero-subtitle-exact">
            Discover how NEXA24 is transforming healthcare management and empowering practices across the globe.
          </p>
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
                  <p className="testimonial-content">{t.content}</p>
                  <div className="testimonial-author">
                    <h4>{t.authorName}</h4>
                    <p className="author-role">{t.role ? `${t.role}, ` : ''}{t.organization}</p>
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
