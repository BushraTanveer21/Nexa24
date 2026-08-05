import React from 'react';

const CoreValues = () => {
  return (
    <section id="how-it-works" className="how-it-works-exact container" style={{ position: 'relative', overflow: 'hidden' }}>
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
      <div className="how-header-exact" style={{ position: 'relative', zIndex: 1 }}>
        <div className="eyebrow-exact">HOW IT WORKS</div>
        <h2>Simple Steps, <span className="purple-text">Powerful Impact.</span></h2>
      </div>
      <div className="how-grid-exact" style={{ position: 'relative', zIndex: 1 }}>
        <div className="how-step-exact">
          <div className="how-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
          <h4>Step 01<br/>Consultation</h4>
          <p>We understand your needs and goals.</p>
        </div>
        <div className="how-step-exact">
          <div className="how-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
          <h4>Step 02<br/>Customized Plan</h4>
          <p>We design a solution fit for your practice.</p>
        </div>
        <div className="how-step-exact">
          <div className="how-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
          <h4>Step 03<br/>Seamless Integration</h4>
          <p>Our team integrates and gets you started.</p>
        </div>
        <div className="how-step-exact">
          <div className="how-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
          <h4>Step 04<br/>Ongoing Support</h4>
          <p>We provide continuous support and optimization.</p>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
