import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import CeoAboutUs from '../components/Home/CeoAboutUs';
import CompanyIntro from '../components/Home/CompanyIntro';
import Advantage from '../components/Home/Advantage';
import ServicesOverview from '../components/Home/ServicesOverview';
import TestimonialsPreview from '../components/Home/TestimonialsPreview';
import ContactSection from '../components/Home/ContactSection';

const HomePage = () => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', zIndex: 30, backgroundColor: '#fff' }}>
          <HeroSection />
        </div>
        <CeoAboutUs />
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