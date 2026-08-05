import React from 'react';
import Tilt from 'react-parallax-tilt';

const Advantage = () => {
  return (
    <section className="advantage-exact container" id="solutions" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Right Corner Decorative Watercolor Leaves */}
      <img 
        src="/watercolor_leaves.png" 
        alt="Decorative Watercolor Leaves Right" 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '330px',
          height: 'auto',
          opacity: 0.88,
          pointerEvents: 'none',
          zIndex: 0,
          mixBlendMode: 'multiply',
          transform: 'scaleX(-1)'
        }}
      />

      <div className="advantage-header-exact" style={{ position: 'relative', zIndex: 1 }}>
        <div className="eyebrow-exact">WHY CHOOSE NEXA24</div>
        <h2>Why Choose <span className="purple-text">NEXA24.</span></h2>
      </div>
      
      <div className="advantage-grid-exact" style={{ position: 'relative', zIndex: 1 }}>
        <div className="advantage-cards-exact">
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="adv-card-tilt-wrapper">
            <div className="adv-card-exact">
              <div className="adv-icon-exact">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <h4>Human + Technology</h4>
                <p>We blend the best technology with a human touch to deliver empathetic care.</p>
              </div>
            </div>
          </Tilt>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="adv-card-tilt-wrapper">
            <div className="adv-card-exact">
              <div className="adv-icon-exact">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <div>
                <h4>Scalable Solutions</h4>
                <p>Flexible and scalable solution designed to grow with your practice.</p>
              </div>
            </div>
          </Tilt>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="adv-card-tilt-wrapper">
            <div className="adv-card-exact">
              <div className="adv-icon-exact">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h4>Expert Team</h4>
                <p>A team of healthcare and technology experts dedicated to excellence.</p>
              </div>
            </div>
          </Tilt>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="adv-card-tilt-wrapper">
            <div className="adv-card-exact">
              <div className="adv-icon-exact">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div>
                <h4>Dedicated Support</h4>
                <p>We provide continuous support and optimization.</p>
              </div>
            </div>
          </Tilt>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', maxWidth: '450px', margin: '0 auto' }}>
          <div className="detail-photo-wrapper" style={{ width: '100%' }}>
            <img src="/doctor_purple.png" alt="Doctor" className="detail-hero-photo" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantage;
