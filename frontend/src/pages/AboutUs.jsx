import React from "react";
import {
  Star,
  ShieldCheck,
  Users,
  TrendingUp,
  Target,
  Eye,
  Clock,
} from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";
import branchTL from "../assets/botanical-branch-tl.png";
import ceoImage from "../assets/ceo-yamna.jpg";
import useScrollReveal from "../hooks/useScrollReveal";



import WHY_CHOOSE_US from "../data/whyChooseUs";


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
      {}
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-tl" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-mr" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-br" />

      {}
      <section className="about-hero-wrap">
        <div className="about-logo-pulse reveal">
          <div className="about-logo-glow">
            <img src={nexaLogo} alt="NEXA24 Healthcare" className="about-logo-mark" />
          </div>
        </div>
      </section>

      {}
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

      {}
      <section className="about-mv-section">
        <div className="about-mv-grid">
          <div className="about-mv-card reveal">
            <div className="about-mv-icon">
              <Target size={26} />
            </div>
            <h3>Our Mission</h3>
            <div className="about-bio-underline" />
            <p>
              To empower healthcare providers with reliable, efficient, and 24/7
              back-office support so they can focus on what matters most — patient
              care. We combine skilled professionals, smart processes, and modern
              technology to reduce administrative stress, improve revenue, and help
              practices grow.
            </p>
          </div>

          <div className="about-mv-card reveal" style={{ transitionDelay: "120ms" }}>
            <div className="about-mv-icon">
              <Eye size={26} />
            </div>
            <h3>Our Vision</h3>
            <div className="about-bio-underline" />
            <p>
              To be the most trusted healthcare operations partner worldwide. We
              envision a future where every medical practice, big or small, has
              access to next-generation support that is affordable, accurate, and
              always available.
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="about-bio-section">
        <div className="about-bio-grid">
          {}
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

          {}
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
                <h3>Yamna Shahid</h3>
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
                      <Clock size={16} />
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

      {}
      <section className="about-why-section">
        <h2 className="about-why-heading">Why Choose NEXA24 Healthcare</h2>

        <div className="about-why-grid">
          {WHY_CHOOSE_US.map((item, i) => (
            <div
              className="about-why-item reveal"
              style={{ transitionDelay: `${i * 90}ms` }}
              key={item.title}
            >
              <div className="about-why-icon">
                <item.Icon size={22} />
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <p className="about-promise center">
          We handle the backend. You heal the frontline. 24/7.
        </p>
      </section>
    </div>
  );
}