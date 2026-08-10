import React, { useEffect, useState } from 'react';
import md5 from 'md5';
import Tilt from 'react-parallax-tilt';
import { Star } from 'lucide-react';
import '../pages/TestimonialPage.css';

const renderVideoPlayer = (url) => {
  if (!url) return null;

  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: '100%', height: '280px', borderRadius: '12px', border: 'none', display: 'block' }}
      ></iframe>
    );
  }

  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
        title="Vimeo video player"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '280px', borderRadius: '12px', border: 'none', display: 'block' }}
      ></iframe>
    );
  }

  return (
    <video
      src={url}
      controls
      style={{ width: '100%', height: '280px', display: 'block', objectFit: 'cover', borderRadius: '12px' }}
    />
  );
};

const TestimonialsPreview = () => {
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
        
        // Filter enabled testimonials
        const activeTestimonials = data.filter(t => t.isEnabled !== false);
        
        // Sort by best rating first (descending)
        activeTestimonials.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        
        // Take the top 3
        setTestimonials(activeTestimonials.slice(0, 3));
      } catch (err) {
        setTestimonials([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [API_URL]);

  // Determine what to display in the grid
  const displayCards = testimonials.length > 0 
    ? testimonials 
    : [
        { _id: 'empty-1', message: 'No testimonials available yet. Check back soon!', name: 'Coming Soon', position: 'NEXA24' },
        { _id: 'empty-2', message: 'No testimonials available yet. Check back soon!', name: 'Coming Soon', position: 'NEXA24' },
        { _id: 'empty-3', message: 'No testimonials available yet. Check back soon!', name: 'Coming Soon', position: 'NEXA24' }
      ];

  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#F3E8FF', position: 'relative', overflow: 'hidden' }}>
      {/* Left Corner Decorative Watercolor Leaves */}
      <img 
        src="/watercolor_leaves.png" 
        alt="Decorative Watercolor Leaves Left" 
        className="decorative-watercolor-leaf"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '330px',
          height: 'auto',
          opacity: 0.88,
          pointerEvents: 'none',
          zIndex: 0,
          mixBlendMode: 'multiply'
        }}
      />
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        <div className="how-header-exact" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="eyebrow-exact" style={{ justifyContent: 'center' }}>CLIENT STORIES</div>
          <h2>Hear from our <span className="purple-text">partners.</span></h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="testimonial-grid">
              {displayCards.map((t) => (
                <Tilt key={t._id} tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="testimonial-card-wrapper">
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      {(() => {
                        if (t.type === 'video' || t.videoUrl) return null;
                        if (t.image) {
                          return <img src={t.image} alt={t.name} className="testimonial-author-image" style={{ borderRadius: '50%', objectFit: 'cover' }} />;
                        }
                        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'User')}&background=random&color=fff&size=128`;
                        
                        return (
                          <img src={fallbackUrl} alt={t.name} className="testimonial-author-image" style={{ borderRadius: '50%', objectFit: 'cover' }} />
                        );
                      })()}
                      <div className="testimonial-author-info">
                        <h4>{t.name}</h4>
                        <p className="author-role">{t.position}</p>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < (t.rating || 5) ? "#7c3aed" : "transparent"} color="#7c3aed" />
                          ))}
                        </div>
                      </div>
                    </div>
                    {t.videoUrl && (
                      <div className="testimonial-video-container" style={{ marginTop: '16px', marginBottom: '0', marginLeft: '-20px', marginRight: '-20px', borderRadius: '12px', overflow: 'hidden' }}>
                        {renderVideoPlayer(t.videoUrl)}
                      </div>
                    )}
                    {t.message && (
                      <>
                        <div className="quote-icon">"</div>
                        <p className="testimonial-content">{t.message}</p>
                      </>
                    )}
                  </div>
                </Tilt>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <a href="/testimonial" className="btn-purple-exact">
                View All Client Stories
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsPreview;
