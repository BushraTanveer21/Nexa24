import React, { useState, useEffect } from 'react';
import { Users, FileText, ShieldCheck, Megaphone, DollarSign, Package } from 'lucide-react';
import FallingPetals from './FallingPetals';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ICON_RULES = [
  { test: /virtual|assist/i, Icon: Users },
  { test: /billing/i, Icon: FileText },
  { test: /credential/i, Icon: ShieldCheck },
  { test: /marketing/i, Icon: Megaphone },
  { test: /rcm|revenue|solution/i, Icon: DollarSign },
];

function renderServiceIcon(service) {
  if (service.image) {
    return <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />;
  }
  const match = ICON_RULES.find((rule) => rule.test.test(service.title || ''));
  const IconComponent = match ? match.Icon : Package;
  return <IconComponent size={20} strokeWidth={2} />;
}

const ServicesOverview = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {});
  }, []);

  const toggleActive = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="services-exact container" id="services" style={{ position: 'relative', overflow: 'hidden' }}>
      <FallingPetals />
      
      {}
      <img 
        src="/image.png?v=5" 
        alt="Decorative leaf branch" 
        className="decorative-leaf decorative-leaf-services"
      />
      <div className="services-split-exact" style={{ position: 'relative', zIndex: 1 }}>
        <div className="services-left-exact">
          <div className="eyebrow-exact">WHAT WE DO</div>
          <h2>Comprehensive Solutions for<br/><span className="purple-text">Modern Healthcare</span></h2>
          <p>We provide comprehensive healthcare support services<br/>powered by technology and delivered by experts.</p>
        </div>
        <div className="services-right-exact">
          {services.map((s, i) => (
            <div 
              className="service-item-exact" 
              key={s._id || i}
              onClick={() => toggleActive(i)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 0,
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--bg-exact)',
                border: activeIndex === i ? '1px solid var(--primary-light)' : '1px solid transparent',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '16px',
                boxShadow: activeIndex === i ? '0 4px 20px rgba(109, 40, 217, 0.08)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px' }}>
                <div 
                  className="service-icon-exact"
                  style={{
                    backgroundColor: s.image ? 'transparent' : (activeIndex === i ? 'var(--primary-exact)' : 'var(--bg-lavender)'),
                    color: activeIndex === i ? 'var(--white)' : 'var(--primary-exact)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                >
                  {renderServiceIcon(s)}
                </div>
                <h3 style={{ flex: 1, margin: 0, fontSize: '16px', fontWeight: '700', color: activeIndex === i ? 'var(--primary-exact)' : 'var(--text-dark-exact)' }}>
                  {s.title}
                </h3>
                <div 
                  className="service-arrow-exact"
                  style={{
                    transform: activeIndex === i ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: activeIndex === i ? 'var(--primary-exact)' : 'var(--text-muted-exact)'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>

              <div 
                style={{
                  maxHeight: activeIndex === i ? '200px' : '0px',
                  opacity: activeIndex === i ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.3s ease',
                  marginTop: activeIndex === i ? '14px' : '0px',
                  paddingLeft: '52px', 
                  color: 'var(--text-muted-exact)',
                  fontSize: '14.5px',
                  lineHeight: '1.6'
                }}
              >
                {s.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
