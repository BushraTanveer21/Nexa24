import React, { useRef, useEffect, useState } from 'react';
import bgVideo from '../assets/final video.mp4';

export default function HeroSection() {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const activeVideoRef = useRef(1);
  const isFadingRef = useRef(false);
  const fadeTime = 0.8; // 0.8s makes the transition buttery smooth and invisible

  const blobUrlRef = useRef(null);

  useEffect(() => {
    // 1. Silent Blob Hotswap for slow internet
    fetch(bgVideo)
      .then(res => res.blob())
      .then(blob => {
        blobUrlRef.current = URL.createObjectURL(blob);
      })
      .catch(e => console.log('Blob fetch error:', e));

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Start initial video
    v1.play().catch(e => console.log('Autoplay prevented:', e));

    let animationFrameId;

    const tick = () => {
      const active = activeVideoRef.current === 1 ? v1 : v2;
      const next = activeVideoRef.current === 1 ? v2 : v1;

      if (active.duration) {
        const timeRemaining = active.duration - active.currentTime;

        if (timeRemaining <= fadeTime && !isFadingRef.current) {
          isFadingRef.current = true;
          
          next.currentTime = 0;
          
          // CRITICAL FIX: We must wait for the video to actually start decoding frames
          // before we trigger the CSS fade. Otherwise, it fades in a frozen frame!
          const playPromise = next.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              // Video is now fully moving and active. Begin the smooth fade!
              next.style.transition = `opacity ${fadeTime}s ease-in-out`;
              next.style.opacity = 1;
              next.style.zIndex = 2;
              
              active.style.zIndex = 1;

              setTimeout(() => {
                active.pause();
                active.style.transition = 'none';
                active.style.opacity = 0;
                
                // Hot-swap to RAM blob for zero network buffering on future loops
                if (blobUrlRef.current && !active.src.startsWith('blob:')) {
                  active.src = blobUrlRef.current;
                  active.load();
                }

                activeVideoRef.current = activeVideoRef.current === 1 ? 2 : 1;
                isFadingRef.current = false;
              }, fadeTime * 1000);

            }).catch(e => {
              console.log(e);
              isFadingRef.current = false; // Reset if play fails
            });
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="hero-section-container" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff', color: '#111827', fontFamily: 'sans-serif', minHeight: '620px', display: 'flex', alignItems: 'center' }}>
      
      {/* Background Video Layer */}
      <div className="hero-video-layer" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <video 
          ref={video1Ref}
          autoPlay 
          muted 
          loop
          playsInline 
          preload="auto"
          className="hero-video-element"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center top',
            position: 'absolute', 
            top: 0, 
            left: 0,
            filter: 'brightness(1.25) contrast(1.15)',
            zIndex: 1
          }}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        <video 
          ref={video2Ref}
          muted 
          loop
          playsInline 
          preload="auto"
          className="hero-video-element"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center top',
            position: 'absolute', 
            top: 0, 
            left: 0,
            filter: 'brightness(1.25) contrast(1.15)',
            opacity: 0,
            zIndex: 0
          }}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
      <div className="hero-content-wrapper" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', padding: '50px 0' }}>
        <div className="hero-text-wrapper" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <main className="hero-main-content" style={{ maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div>
              <span style={{ color: '#4C1D95', fontSize: '11px', letterSpacing: '1px', fontWeight: '700', backgroundColor: '#F3E8FF', border: '1px solid #D8B4E2', padding: '6px 14px', borderRadius: '20px', display: 'inline-block', textTransform: 'uppercase' }}>
                NEXT-LEVEL CARE
              </span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.8rem)', margin: 0, lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.5px', color: '#111827' }}>
              Healthcare that never<br />stops, <span style={{ color: '#4C1D95' }}>care that always</span><br />continues.
            </h1>
            
            <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.6', margin: '0', maxWidth: '480px', fontWeight: '500' }}>
              At NEX24, we combine advanced clinical intelligence with human empathy to deliver uninterrupted, round-the-clock care and support.
            </p>

            <div className="hero-buttons-wrapper" style={{ marginTop: '12px', display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <a href="/services" style={{ fontSize: '14px', padding: '12px 26px', borderRadius: '24px', color: '#ffffff', backgroundColor: '#4C1D95', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(76, 29, 149, 0.25)' }}>
                Explore Our Services
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </a>
              <a href="/contact" style={{ fontSize: '14px', padding: '12px 26px', borderRadius: '24px', color: '#111827', backgroundColor: '#ffffff', border: '1px solid #D1D5DB', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)' }}>
                Talk to an Expert
              </a>
            </div>
          </main>
        </div>
      </div>
      
    </div>
  );
}

