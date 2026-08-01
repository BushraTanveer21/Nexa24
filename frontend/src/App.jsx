import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComingSoonPage from './pages/ComingSoonPage';

function ScrollAnimations() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll('section').forEach((el) => {
        el.classList.add('anim-section');
        observer.observe(el);
      });

      const cardSelectors = [
        '.card',
        '.service-card',
        '.adv-card',
        '.nexa-meaning-card',
        '.timeline-step',
        '.contact-form-card',
        '.about-promise',
        '.hero-inner',
        '.sov-card'
      ];

      document.querySelectorAll(cardSelectors.join(', ')).forEach((el, i) => {
        el.classList.add('anim-card');
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter((c) =>
            c.classList.contains('anim-card')
          );
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = `${idx * 0.1}s`;
        }
        observer.observe(el);
      });

      document.querySelectorAll(
        '.about-us-headline, .about-us-desc, .about-eyebrow, .eyebrow, .hero-text h1, .hero-tagline, .hero-ctas, .hero-promise, .contact-info h2, .contact-info p'
      ).forEach((el, i) => {
        el.classList.add('anim-fade');
        el.style.transitionDelay = `${i * 0.08}s`;
        observer.observe(el);
      });
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
            <Route path="*" element={<ComingSoonPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;