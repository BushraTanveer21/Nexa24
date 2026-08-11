import React, { useEffect, useState } from 'react';

import Tilt from 'react-parallax-tilt';
import { Star, MessageSquarePlus } from 'lucide-react';
import './TestimonialPage.css';
import branchTL from "../assets/botanical-branch-tl.png";
import TestimonialSubmitModal from '../components/TestimonialSubmitModal';

const ExpandableText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) return null;
  
  if (text.length <= maxLength) {
    return <p className="testimonial-content">{text}</p>;
  }

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <p className="testimonial-content" style={{ flexGrow: 0, marginBottom: '8px' }}>
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#7c3aed', fontWeight: 'bold', cursor: 'pointer', padding: '0', fontSize: '0.95rem' }}
      >
        {isExpanded ? "View Less" : "View More"}
      </button>
    </div>
  );
};

const InteractiveVideoPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Validate URL format
  if (!/^(https?:\/\/|\/|blob:)/i.test(trimmed)) {
    return null;
  }

  const ytRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const src = `https://www.youtube.com/embed/${ytMatch[1]}` + (isPlaying ? "?autoplay=1" : "");
    return (
      <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden' }} onClick={() => setIsPlaying(true)}>
        <iframe
          src={src}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: isPlaying ? 'auto' : 'none' }}
        ></iframe>
        {!isPlaying && (
           <div className="video-play-overlay">
              <div className="play-button-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
           </div>
        )}
      </div>
    );
  }

  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const src = `https://player.vimeo.com/video/${vimeoMatch[1]}` + (isPlaying ? "?autoplay=1" : "");
    return (
      <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden' }} onClick={() => setIsPlaying(true)}>
        <iframe
          src={src}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: isPlaying ? 'auto' : 'none' }}
        ></iframe>
        {!isPlaying && (
           <div className="video-play-overlay">
              <div className="play-button-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
           </div>
        )}
      </div>
    );
  }

  const instaRegex = /(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/;
  const instaMatch = trimmed.match(instaRegex);
  if (instaMatch && instaMatch[1]) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden' }} onClick={() => window.open(trimmed, '_blank')}>
        <iframe
          src={`https://www.instagram.com/p/${instaMatch[1]}/embed`}
          title="Instagram video player"
          frameBorder="0"
          scrolling="no"
          allowTransparency="true"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: 'none' }}
        ></iframe>
        <div className="video-play-overlay">
          <div className="play-button-icon" title="Watch on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const tiktokRegex = /(?:tiktok\.com\/@[\w.-]+\/video\/|v[mt]\.tiktok\.com\/)(\d+)/;
  const tiktokMatch = trimmed.match(tiktokRegex);
  if (tiktokMatch && tiktokMatch[1]) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '12px', overflow: 'hidden' }} onClick={() => window.open(trimmed, '_blank')}>
        <iframe
          src={`https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`}
          title="TikTok video player"
          frameBorder="0"
          allow="fullscreen"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: 'none' }}
        ></iframe>
        <div className="video-play-overlay">
          <div className="play-button-icon" title="Watch on TikTok">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const xRegex = /(?:twitter\.com|x\.com)\/(?:#!\/)?(?:\w+)\/status\/(\d+)/;
  const xMatch = trimmed.match(xRegex);
  if (xMatch && xMatch[1]) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden' }} onClick={() => window.open(trimmed, '_blank')}>
        <iframe
          src={`https://platform.twitter.com/embed/Tweet.html?id=${xMatch[1]}`}
          title="X/Twitter video player"
          frameBorder="0"
          scrolling="no"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: 'none' }}
        ></iframe>
        <div className="video-play-overlay">
          <div className="play-button-icon" title="Watch on X">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }} onClick={(e) => {
      if(!isPlaying) {
        setIsPlaying(true);
        const video = e.currentTarget.querySelector('video');
        if (video) video.play();
      }
    }}>
      <video
        controls={isPlaying}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: isPlaying ? 'auto' : 'none' }}
        onError={(e) => {
          if (e.currentTarget.parentElement) {
            e.currentTarget.parentElement.style.display = 'none';
          }
        }}
      >
        <source src={trimmed} />
        Your browser does not support the video tag.
      </video>
      {!isPlaying && (
         <div className="video-play-overlay">
            <div className="play-button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
         </div>
      )}
    </div>
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
      } catch {
        // Silently catch the error on Vercel and just show the empty state instead of crashing
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [API_URL]);

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
          ) : testimonials.length === 0 ? (
            <div className="empty-state">
              <p>No testimonials available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="testimonial-grid" style={{ marginBottom: '40px' }}>
                {testimonials.map((t) => (
                  <Tilt key={t._id} tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="testimonial-card-wrapper">
                      <div className="testimonial-card">
                        <div className="testimonial-author" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {(() => {
                              if (t.image) {
                                return <img src={t.image} alt={t.name} className="testimonial-author-image" style={{ borderRadius: '50%', objectFit: 'cover' }} />;
                              }
                              const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'User')}&background=random&color=fff&size=128&length=1`;
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
                        {hasValidVideo(t) && (
                          <div className="testimonial-video-container" style={{ marginTop: '16px', marginBottom: '0', marginLeft: '-20px', marginRight: '-20px', borderRadius: '12px', overflow: 'hidden' }}>
                            <InteractiveVideoPlayer url={t.videoUrl} />
                          </div>
                        )}
                        {t.message && (
                          <>
                            <div className="quote-icon">"</div>
                            <ExpandableText text={t.message} />
                          </>
                        )}
                      </div>
                  </Tilt>
                ))}
              </div>
            </>
        )}
        </div>
      </section>
      
      {showSubmitModal && <TestimonialSubmitModal onClose={() => setShowSubmitModal(false)} />}
    </div>
  );
}
