import React, { useEffect, useState } from 'react';


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

import Tilt from 'react-parallax-tilt';
import { Star } from 'lucide-react';
import "../../pages/TestimonialPage.css";

const InteractiveVideoPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  
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



const TestimonialsPreview = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/api/testimonials/featured`);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        
        
        const activeTestimonials = data.filter(t => t.isEnabled !== false);
        
        
        activeTestimonials.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        
        
        setTestimonials(activeTestimonials.slice(0, 3));
      } catch {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [API_URL]);

  
  const displayCards = testimonials.length > 0 
    ? testimonials 
    : [
        { _id: 'empty-1', message: 'No testimonials available yet. Check back soon!', name: 'Coming Soon', position: 'NEXA24' },
        { _id: 'empty-2', message: 'No testimonials available yet. Check back soon!', name: 'Coming Soon', position: 'NEXA24' },
        { _id: 'empty-3', message: 'No testimonials available yet. Check back soon!', name: 'Coming Soon', position: 'NEXA24' }
      ];

  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#F3E8FF', position: 'relative', overflow: 'hidden' }}>
      {}
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
                    {t.videoUrl && (
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
