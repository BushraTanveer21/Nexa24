import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsBanner from '../components/StatsBanner';
import AboutUs from '../components/AboutUs';
import Advantage from '../components/Advantage';
import ServicesOverview from '../components/ServicesOverview';
import TestimonialsPreview from '../components/TestimonialsPreview';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', zIndex: 30, backgroundColor: '#fff' }}>
          <HeroSection />
        </div>
        <StatsBanner />
        <AboutUs />
        <Advantage />
        <ServicesOverview />
        <TestimonialsPreview />
        <ContactSection />
      </div>
    </div>
  );
};

export default HomePage;
