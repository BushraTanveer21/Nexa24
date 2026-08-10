import React, { useEffect, useState } from 'react';
import md5 from 'md5';
import Tilt from 'react-parallax-tilt';
import { Star, MessageSquarePlus } from 'lucide-react';
import './TestimonialPage.css';
import branchTL from "../assets/botanical-branch-tl.png";
import TestimonialSubmitModal from '../components/TestimonialSubmitModal';

const renderVideoPlayer = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Validate URL format
  if (!/^(https?:\/\/|\/|blob:)/i.test(trimmed)) {
    return null;
  }

  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = trimmed.match(ytRegex);
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

  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
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

  const instaRegex = /(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/;
  const instaMatch = trimmed.match(instaRegex);
  if (instaMatch && instaMatch[1]) {
    return (
      <iframe
        src={`https://www.instagram.com/p/${instaMatch[1]}/embed`}
        title="Instagram video player"
        frameBorder="0"
        scrolling="no"
        allowTransparency="true"
        style={{ width: '100%', height: '360px', borderRadius: '12px', border: 'none', display: 'block', overflow: 'hidden' }}
      ></iframe>
    );
  }

  const tiktokRegex = /(?:tiktok\.com\/@[\w.-]+\/video\/|v[mt]\.tiktok\.com\/)(\d+)/;
  const tiktokMatch = trimmed.match(tiktokRegex);
  if (tiktokMatch && tiktokMatch[1]) {
    return (
      <iframe
        src={`https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`}
        title="TikTok video player"
        frameBorder="0"
        allow="fullscreen"
        style={{ width: '100%', height: '380px', borderRadius: '12px', border: 'none', display: 'block' }}
      ></iframe>
    );
  }

  const xRegex = /(?:twitter\.com|x\.com)\/(?:#!\/)?(?:\w+)\/status\/(\d+)/;
  const xMatch = trimmed.match(xRegex);
  if (xMatch && xMatch[1]) {
    return (
      <iframe
        src={`https://platform.twitter.com/embed/Tweet.html?id=${xMatch[1]}`}
        title="X/Twitter video player"
        frameBorder="0"
        scrolling="no"
        style={{ width: '100%', height: '360px', borderRadius: '12px', border: 'none', display: 'block' }}
      ></iframe>
    );
  }

  return (
    <video
      src={trimmed}
      controls
      onError={(e) => {
        if (e.currentTarget.parentElement) {
          e.currentTarget.parentElement.style.display = 'none';
        }
      }}
      style={{ width: '100%', height: '280px', display: 'block', objectFit: 'cover', borderRadius: '12px' }}
    />
  );
};

const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const hasValidVideo = (t) => {
  return t && t.videoUrl && typeof t.videoUrl === 'string' && /^(https?:\/\/|\/|blob:)/i.test(t.videoUrl.trim());
};

export default function TestimonialPage() {

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
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
        <div className="section-inner">
          <div className="testimonial-actions-bar" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', marginTop: '-30px' }}>
            <button className="btn-primary-purple" onClick={() => setShowSubmitModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', padding: '12px 24px', borderRadius: '30px' }}>
              <MessageSquarePlus size={20} /> Share Your Experience
            </button>
          </div>

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
            <>
              {testimonials.filter(hasValidVideo).length > 0 && (
                <div className="testimonial-grid" style={{ marginBottom: '40px' }}>
                {testimonials.filter(hasValidVideo).map((t) => (
                  <Tilt key={t._id} tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="testimonial-card-wrapper">
                      <div className="testimonial-card">
                        <div className="testimonial-author" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                          {(t.date || t.createdAt) && (
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', whiteSpace: 'nowrap' }}>
                              {formatDate(t.date || t.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="testimonial-video-container" style={{ marginTop: '16px', marginBottom: '0', marginLeft: '-20px', marginRight: '-20px', borderRadius: '12px', overflow: 'hidden' }}>
                          {renderVideoPlayer(t.videoUrl)}
                        </div>
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
              )}

              {testimonials.filter(t => !hasValidVideo(t)).length > 0 && (
                <div className="testimonial-grid">
                {testimonials.filter(t => !hasValidVideo(t)).map((t) => (
                  <Tilt key={t._id} tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="testimonial-card-wrapper">
                      <div className="testimonial-card">
                        <div className="testimonial-author" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {(() => {
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
                          {(t.date || t.createdAt) && (
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', whiteSpace: 'nowrap' }}>
                              {formatDate(t.date || t.createdAt)}
                            </span>
                          )}
                        </div>
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
              )}
            </>
        )}
        </div>
      </section>
      
      {showSubmitModal && <TestimonialSubmitModal onClose={() => setShowSubmitModal(false)} />}
    </div>
  );
}
