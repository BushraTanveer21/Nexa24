import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
    <div className="hero-section-container" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff', color: '#111827', minHeight: '620px', display: 'flex', alignItems: 'center' }}>
      
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
          <main className="hero-content reveal" style={{ maxWidth: '540px', textAlign: 'left', margin: '0' }}>
            <span className="eyebrow" style={{ display: 'inline-flex', marginBottom: '16px' }}>
              <span className="dot" />
              NEXT-LEVEL CARE
            </span>
            
            <h1 style={{ textAlign: 'left' }}>
              Healthcare that never<br />stops, <span>care that always</span><br />continues.
            </h1>
            
            <p style={{ textAlign: 'left' }}>
              At NEXA24, we combine advanced clinical intelligence with human empathy to deliver uninterrupted, round-the-clock care and support.
            </p>

            <div className="hero-ctas" style={{ justifyContent: 'flex-start' }}>
              <a href="/services" className="btn-primary">
                Explore Our Services
                <ArrowRight size={16} style={{ display: "inline", verticalAlign: "-3px", marginLeft: 8 }} />
              </a>
            </div>
          </main>
        </div>
      </div>
      
    </div>
  );
}

