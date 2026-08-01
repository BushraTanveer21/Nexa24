import React from 'react';

export default function HeroSection() {
  return (
    <div className="hero-section-container" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff', color: '#111827', fontFamily: 'sans-serif', minHeight: '620px', display: 'flex', alignItems: 'center' }}>
      
      {/* Background Video Layer */}
      <div className="hero-video-layer" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <video 
          key="/Final_Video_Lavender_Tree.mp4"
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video-element"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center top',
            position: 'absolute', 
            top: 0, 
            left: 0,
            filter: 'brightness(1.06) contrast(1.05)'
          }}
        >
          <source src="/Final_Video_Lavender_Tree.mp4" type="video/mp4" />
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

