import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ComingSoonPage = () => {
  const location = useLocation();

  // Format path to readable page title (e.g. /services -> Services)
  const rawPath = location.pathname.replace('/', '');
  const pageName = rawPath 
    ? rawPath.charAt(0).toUpperCase() + rawPath.slice(1) 
    : 'Feature';

  return (
    <div 
      className="coming-soon-container"
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        backgroundColor: '#faf8fc',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div 
        className="coming-soon-card"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '640px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          padding: '48px 36px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(76, 29, 149, 0.08)',
          border: '1px solid rgba(216, 180, 226, 0.4)'
        }}
      >
        {/* Eyebrow Badge */}
        <div style={{ marginBottom: '20px' }}>
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4C1D95',
              fontSize: '12px',
              letterSpacing: '1.2px',
              fontWeight: '700',
              backgroundColor: '#F3E8FF',
              border: '1px solid #D8B4E2',
              padding: '6px 16px',
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}
          >
            <span 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#9333EA',
                display: 'inline-block',
                boxShadow: '0 0 8px #9333EA'
              }}
            />
            {pageName} Page Coming Soon
          </span>
        </div>

        {/* Icon Accent */}
        <div 
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 24px auto',
            borderRadius: '24px',
            backgroundColor: '#F3E8FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4C1D95'
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>

        {/* Title */}
        <h1 
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
            fontWeight: '800',
            color: '#111827',
            margin: '0 0 16px 0',
            lineHeight: '1.2'
          }}
        >
          This Page Will Be <br />
          <span style={{ color: '#4C1D95' }}>Available Soon</span>
        </h1>

        {/* Description */}
        <p 
          style={{
            fontSize: '15px',
            color: '#4B5563',
            lineHeight: '1.6',
            margin: '0 0 32px 0',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          We are currently enhancing the <strong>{pageName}</strong> experience to bring you advanced healthcare capabilities and seamless support. Check back shortly!
        </p>

        {/* Action CTAs */}
        <div 
          style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Link 
            to="/" 
            style={{
              padding: '12px 28px',
              borderRadius: '24px',
              backgroundColor: '#4C1D95',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(76, 29, 149, 0.25)'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
