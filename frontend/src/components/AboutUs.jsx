import React from 'react';
import Tilt from 'react-parallax-tilt';

const AboutUs = () => {
  return (
    <section className="about-exact container" id="about" style={{ position: 'relative', overflow: 'hidden', padding: '80px 5%', background: 'var(--white)' }}>

      {/* Attached to the top-left corner of the AboutUs section */}
      <img 
        src="/image.png?v=4" 
        alt="Decorative leaf branch" 
        className="decorative-leaf-about"
        style={{ 
          position: 'absolute', 
          top: 0,
          left: 0,
          opacity: 0.95,
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      <div className="about-header" style={{ position: 'relative', zIndex: 1, marginBottom: '40px', textAlign: 'center' }}>
        <div className="eyebrow-exact" style={{ color: 'var(--primary-exact)', fontWeight: '600', letterSpacing: '1px', marginBottom: '16px' }}>COMPANY INTRODUCTION</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 36px)', fontWeight: '800', color: 'var(--text-dark-exact)' }}>Welcome to <span className="purple-text">NEXA24 HEALTHCARE</span></h2>
      </div>
      
      <div className="about-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
        <div className="about-text" style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--text-muted-exact)' }}>
          <p style={{ marginBottom: '24px' }}>
            At NEXA24 HEALTHCARE, we believe healthcare should be simple, accessible, and available whenever you need it.
          </p>
          <p style={{ marginBottom: '24px' }}>
            We are a next-generation healthcare company dedicated to providing 24/7 quality medical services with compassion, innovation, and trust at our core. From preventive care to advanced treatment, our mission is to put patients first and deliver excellence at every step.
          </p>
          <p style={{ marginBottom: '24px' }}>
            With a team of experienced professionals and a focus on modern healthcare solutions, NEXA24 HEALTHCARE is here to support you and your loved ones — anytime, any day.
          </p>
          <p style={{ fontWeight: '700', color: 'var(--text-dark-exact)', fontSize: '20px' }}>
            Our Promise: <span style={{ color: 'var(--primary-exact)', fontStyle: 'italic' }}>Your Health. Our Priority. 24/7.</span>
          </p>
        </div>
        
        <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.01} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.1} glareColor="white" glarePosition="all" className="about-meaning-tilt-wrapper">
          <div className="about-meaning" style={{ background: 'lavender', padding: '40px', borderRadius: '24px', height: '100%' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'var(--primary-exact)' }}>The Meaning of NEXA24</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-dark-exact)' }}>NEXA</strong> = Derived from "Next" + "Excellence". It represents the next generation of healthcare — innovative, patient-first, and future-ready.
              </li>
              <li style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-dark-exact)' }}>24</strong> = Symbolizes round-the-clock care. We’re here for you 24/7, every day.
              </li>
              <li style={{ marginBottom: '24px', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-dark-exact)' }}>HEALTHCARE</strong> = Our commitment to delivering accessible, reliable, and compassionate medical services.
              </li>
            </ul>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', fontStyle: 'italic', color: 'var(--primary-exact)', fontWeight: '600', lineHeight: '1.5' }}>
              In short: NEXA24 HEALTHCARE = Next-generation excellence in healthcare, available 24/7.
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
};

export default AboutUs;
