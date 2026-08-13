import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import WhatsAppButton from './components/WhatsAppButton';

import TestimonialPage from './pages/TestimonialPage';


import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import AboutUs from "./pages/AboutUs";

function ScrollAnimations() {
  const location = useLocation();

  useEffect(() => {
    
    
    
    if (location.hash) {
      const scrollToHash = () => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };
      
      
      if (!scrollToHash()) {
        const retry = setTimeout(scrollToHash, 150);
        return () => clearTimeout(retry);
      }
    } else {
      window.scrollTo(0, 0);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          
          
          
          
          
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    const applyAnimations = () => {
      document.querySelectorAll('section:not(.reveal)').forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
      });

      const cardSelectors = [
        '.card',
        '.service-card',
        '.adv-card',
        '.adv-card-exact',
        '.how-step-exact',
        '.service-item-exact',
        '.stat-item-exact',
        '.nexa-meaning-card',
        '.timeline-step',
        '.contact-form-card',
        '.contact-form-card-exact',
        '.about-promise',
        '.hero-inner',
        '.sov-card',
        '.testimonial-card',
        '.contact-cta-card'
      ];

      cardSelectors.forEach(selector => {
        document.querySelectorAll(`${selector}:not(.reveal)`).forEach((el, index) => {
          el.style.transitionDelay = `${(index % 10) * 0.1}s`;
          el.classList.add('reveal');
          observer.observe(el);
        });
      });

      document.querySelectorAll(
        '.about-us-headline:not(.reveal), .about-us-desc:not(.reveal), .about-eyebrow:not(.reveal), .eyebrow:not(.reveal), .eyebrow-exact:not(.reveal), .hero-text h1:not(.reveal), .hero-tagline:not(.reveal), .hero-ctas:not(.reveal), .hero-promise:not(.reveal), .contact-info h2:not(.reveal), .contact-info p:not(.reveal)'
      ).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 5) * 0.08}s`;
        observer.observe(el);
      });

      
      document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
      });
    };

    let mutationObserver;

    const timer = setTimeout(() => {
      applyAnimations();
      
      
      mutationObserver = new MutationObserver(() => {
        applyAnimations();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollAnimations />
        <Header />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonial" element={<TestimonialPage />} />

            {}
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;