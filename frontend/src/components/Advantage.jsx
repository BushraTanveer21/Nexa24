import React from 'react';
import Tilt from 'react-parallax-tilt';
import { Clock, Users, ShieldCheck, Layers, TrendingUp } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: Clock,
    title: "24/7 Support",
    description: "We work while you sleep"
  },
  {
    icon: Users,
    title: "Healthcare Experts",
    description: "Team with real billing + credentialing experience"
  },
  {
    icon: ShieldCheck,
    title: "HIPAA Compliant",
    description: "Your data security is our priority"
  },
  {
    icon: Layers,
    title: "One Partner, All Solutions",
    description: "No need to juggle multiple vendors"
  },
  {
    icon: TrendingUp,
    title: "Scalable",
    description: "Services that grow with your practice"
  }
];

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
          {ADVANTAGES.map((adv, idx) => (
            <Tilt key={idx} tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={1000} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="adv-card-tilt-wrapper">
              <div className="adv-card-exact">
                <div className="adv-icon-exact">
                   <adv.icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <h4>{adv.title}</h4>
                  <p>{adv.description}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '450px', margin: '0 auto', width: '100%' }}>
          <div className="detail-photo-wrapper" style={{ width: '100%', flex: 1, maxHeight: 'none' }}>
            <img src="/doctor_purple.png" alt="Doctor" className="detail-hero-photo" style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 'none', borderRadius: '28px' }} />
          </div>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-exact)', fontStyle: 'italic', margin: 0, padding: '0 10px' }}>
            "Our Promise: We handle the backend. You heal the frontline. 24/7."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Advantage;
