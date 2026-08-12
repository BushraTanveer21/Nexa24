import React from 'react';
import HeroSection from '../components/HeroSection';
import CeoAboutUs from '../components/CeoAboutUs';
import StatsBanner from '../components/StatsBanner';
import CompanyIntro from '../components/CompanyIntro';
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
        <CeoAboutUs />
        <StatsBanner />
        <CompanyIntro />
        <Advantage />
        <ServicesOverview />
        <TestimonialsPreview />
        <ContactSection />
      </div>
    </div>
  );
};

export default HomePage;