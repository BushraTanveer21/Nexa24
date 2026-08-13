import React from 'react';
import ceoImage from '../../assets/ceo-yamna.jpg';

const CeoAboutUs = () => {
  return (
    <section
      className="ceo-about-section"
      id="about"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 5%',
        background: '#F3E8FF',
      }}
    >
      <div
        className="about-bio-grid"
        style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--content-max)', margin: '0 auto' }}
      >
        <div className="about-bio-left">
          <span className="eyebrow-dot-label" style={{ color: 'var(--primary)' }}>
            <span className="dot" style={{ background: 'var(--primary)' }} /> CEO &amp; FOUNDER
          </span>
          <h2 style={{ color: 'var(--text-dark)' }}>Meet Our CEO</h2>
          <div className="about-bio-underline" style={{ background: 'var(--primary)' }} />

          <div className="about-info-quote" style={{ paddingLeft: 0 }}>
            <p style={{ fontStyle: 'normal', color: 'var(--text-muted)' }}>
              I started NEXA24 with hard work, passion, and a mission: to help
              healthcare providers thrive. Every service we offer reflects the effort
              and care I've poured into this company. My dream is to set a new
              standard for healthcare support — reliable, compassionate, and
              available 24/7. Welcome to NEXA24. Let's grow together.
            </p>
          </div>

          <h3 style={{ marginTop: '20px', fontSize: '22px', fontWeight: '800', color: 'var(--text-dark)' }}>
            Yamna Shahid
          </h3>
          <p className="about-info-role" style={{ color: 'var(--primary)' }}>
            CEO &amp; Founder, NEXA24 Healthcare LLC
          </p>
        </div>

        <div className="about-bio-right">
          <div className="about-bio-right-inner">
            <div className="about-photo-frame">
              <img
                src={ceoImage}
                alt="Yamna - CEO & Founder"
                className="about-photo-image"
                style={{ aspectRatio: 'auto', height: 'auto', objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeoAboutUs;