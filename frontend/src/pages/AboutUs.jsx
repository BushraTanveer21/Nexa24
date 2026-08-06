import React from "react";
import { Star, ShieldCheck, Users, TrendingUp, Gauge } from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";
import branchTL from "../assets/botanical-branch-tl.png";
import ceoImage from "../assets/ceo-yamna.jpg";
import useScrollReveal from "../hooks/useScrollReveal";

// 4 core values — same slot the mockup used for its 3 bullet items
const CORE_VALUES = [
  {
    icon: Star,
    title: "Excellence",
    description: "Next-gen solutions delivered with precision.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description: "Transparent, compliant, and HIPAA-conscious operations.",
  },
  {
    icon: Users,
    title: "Support",
    description: "Real people, available 24/7.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "We grow when your practice grows.",
  },
];

export default function AboutUs() {
  useScrollReveal();

  return (
    <div className="main-wrapper">
      {/* Background Decorative Botanical Leaves — same pattern as Services page */}
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-tl" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-mr" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-br" />

      {/* ===== ABOUT HERO — big logo blended straight into the page ===== */}
      <section className="about-hero-wrap">
        <div className="about-logo-pulse reveal">
          <div className="about-logo-glow">
            <img src={nexaLogo} alt="NEXA24 Healthcare" className="about-logo-mark" />
          </div>
        </div>
      </section>

      {/* ===== ABOUT US PARAGRAPH ===== */}
      <section className="about-intro-section">
        <div className="about-intro-card reveal">
          <div className="about-divider-label">ABOUT US</div>
          <p>
            At NEXA24 HEALTHCARE, we believe healthcare should be simple, accessible, and
            available whenever you need it. We are a next-generation healthcare company
            dedicated to providing 24/7 quality medical services with compassion,
            innovation, and trust at our core. From preventive care to advanced treatment,
            our mission is to put patients first and deliver excellence at every step.
            With a team of experienced professionals and a focus on modern healthcare
            solutions, NEXA24 HEALTHCARE is here to support you and your loved ones —
            anytime, any day.
          </p>
          <p className="about-promise">Your Health. Our Priority. 24/7.</p>
        </div>
      </section>

      {/* ===== MEET OUR CEO — exact mockup two-column layout ===== */}
      <section className="about-bio-section">
        <div className="about-bio-grid">
          {/* LEFT: intro + core values */}
          <div className="about-bio-left reveal">
            <span className="eyebrow-dot-label">
              <span className="dot" /> CEO &amp; FOUNDER
            </span>
            <h2>Meet Our CEO</h2>
            <div className="about-bio-underline" />
            <p className="about-bio-intro">
              Passionate about healthcare and technology, our CEO is dedicated to
              empowering medical practices with smart, reliable, and future-ready
              solutions.
            </p>

            <div className="about-values-list">
              {CORE_VALUES.map((value, i) => (
                <div className="about-value-item reveal" style={{ transitionDelay: `${i * 90}ms` }} key={value.title}>
                  <div className="about-value-icon">
                    <value.icon size={22} />
                  </div>
                  <div>
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: photo + overlapping info card with Yamna's real intro */}
          <div className="about-bio-right reveal">
            <div className="about-bio-right-inner">
              <div className="about-photo-frame">
                <img 
                  src={ceoImage} 
                  alt="Yamna - CEO & Founder" 
                  className="about-photo-image"
                />
              </div>

              <div className="about-info-card">
                <h3>Yamna</h3>
                <p className="about-info-role">CEO &amp; Founder, NEXA24 Healthcare LLC</p>

                <div className="about-info-quote">
                  <p>
                    I started NEXA24 with hard work, passion, and a mission: to help
                    healthcare providers thrive. Every service we offer reflects the effort
                    and care I've poured into this company. My dream is to set a new
                    standard for healthcare support — reliable, compassionate, and
                    available 24/7. Welcome to NEXA24. Let's grow together.
                  </p>
                </div>

                <div className="about-info-badges">
                  <div className="about-info-badge">
                    <div className="about-info-badge-icon">
                      <Gauge size={16} />
                    </div>
                    <span>Founder-Led, 24/7 Commitment</span>
                  </div>
                  <div className="about-info-badge">
                    <div className="about-info-badge-icon">
                      <Star size={16} />
                    </div>
                    <span>Driven by Passion &amp; Purpose</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}