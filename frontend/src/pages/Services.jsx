import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  MessageSquare,
  Settings,
  Rocket,
  BarChart3,
} from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";
import branchTL from "../assets/botanical-branch-tl.png";
import useScrollReveal from "../hooks/useScrollReveal";
import { resolveIcon } from "../utils/iconMap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function slugify(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const WHY_ITEMS = [
  {
    icon: TrendingUp,
    title: "Faster Revenue",
    description: "Streamlined workflows and clean claims mean faster payments.",
  },
  {
    icon: ShieldCheck,
    title: "Fewer Errors",
    description: "Quality checks and audits reduce denials and rework.",
  },
  {
    icon: UsersRound,
    title: "Dedicated Team",
    description: "Skilled professionals working as an extension of your practice.",
  },
];

const HOW_STEPS = [
  { icon: MessageSquare, label: "01", title: "Consult", description: "We understand your needs and goals." },
  { icon: Settings, label: "02", title: "Setup", description: "We build a custom workflow for you." },
  { icon: Rocket, label: "03", title: "Launch", description: "Our team gets to work seamlessly." },
  { icon: BarChart3, label: "04", title: "Optimize", description: "We monitor, optimize, and drive results." },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setServices(data);
        }
      } catch (err) {
        // Real backend state (empty) is preferred over fake data — leave
        // services as-is (whatever it already was, or empty) on failure.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedServices = services
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Top 5 services for the revolving orbit cards (dynamic from backend)
  const orbitServices = sortedServices.slice(0, 5);

  useScrollReveal([loading, sortedServices.length]);

  return (
    <div className="main-wrapper">
      {/* Background Decorative Botanical Leaves */}
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-tl" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-mr" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-br" />

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="hero-wrap">
        <div className="hero-inner">
          <div className="hero-content reveal">
            <span className="eyebrow">
              <span className="dot" />
              COMPREHENSIVE CLINICAL SUPPORT
            </span>
            <h1>
              Healthcare Operations, <span>Simplified.</span>
            </h1>
            <p>
              NEXA24 streamlines the complex behind-the-scenes work so you can
              focus on what matters most — delivering exceptional patient care.
            </p>
            <div className="hero-ctas">
              <a href="#services" className="btn-primary">
                Explore Services
                <ArrowRight size={16} style={{ display: "inline", verticalAlign: "-3px", marginLeft: 8 }} />
              </a>
              <a href="#how-it-works" className="btn-outline">
                How It Works
              </a>
            </div>
          </div>

          {/* Orbit / Revolving Logo & Dynamic Orbit Cards Cluster */}
          <div className="hero-orbit-container reveal">
            {/* Center Logo Node */}
            <div className="cluster-center">
              <img src={nexaLogo} alt="NEXA24 Healthcare" />
            </div>

            {/* Dynamic Orbit Cards revolving around Center Logo */}
            {orbitServices.map((service, index) => {
              const cardTitle = service.title || service.name;
              const Icon = resolveIcon(service.icon, cardTitle);
              return (
                <div key={service._id || index} className={`orbit-card orbit-card-${index + 1}`}>
                  <div className="cluster-icon"><Icon size={18} /></div>
                  <div className="card-text">
                    <h4>{cardTitle}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SPECIALIZED MANAGED SERVICES SECTION (DYNAMIC FROM BACKEND) ===== */}
      <section id="services" className="services-section">
        <div className="eyebrow-label text-center">OUR SERVICES</div>
        <h2 className="section-heading text-center">Specialized Managed Services</h2>

        <div className="services-grid">
          {sortedServices.map((service) => {
            const serviceTitle = service.title || service.name;
            const Icon = resolveIcon(service.icon, serviceTitle);
            const slug = slugify(serviceTitle);
            return (
              <div className="service-card reveal" key={service._id}>
                <div className="service-card-icon">
                  <Icon size={22} />
                </div>
                <h3>{serviceTitle}</h3>
                <p>{service.description}</p>
                <Link to={`/services/${slug}`} className="service-card-link" aria-label={`Learn more about ${serviceTitle}`}>
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== WHY NEXA24 SECTION ===== */}
      <section id="solutions" className="why-section">
        <div className="eyebrow-label text-center">WHY NEXA24?</div>
        <h2 className="section-heading text-center">Results that drive your practice forward.</h2>

        <div className="why-grid">
          {WHY_ITEMS.map((item) => (
            <div className="why-card reveal" key={item.title}>
              <div className="why-icon">
                <item.icon size={22} />
              </div>
              <div className="why-card-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section id="how-it-works" className="how-section">
        <div className="eyebrow-label text-center">HOW IT WORKS</div>
        <h2 className="section-heading text-center">Simple 4-Step Process</h2>

        <div className="how-steps-grid">
          {HOW_STEPS.map((step) => (
            <div className="how-step-card reveal" key={step.title}>
              <div className="how-card-top">
                <div className="how-icon">
                  <step.icon size={22} />
                </div>
                <div className="how-step-badge">{step.label}</div>
              </div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CALL TO ACTION STRIP ===== */}
      <section id="get-started" className="cta-section">
        <div className="cta-strip reveal">
          <div className="cta-left">
            <div className="cta-plus-icon">
              <img src={nexaLogo} alt="NEXA24" className="cta-logo-img" />
            </div>
            <div className="cta-text">
              <h4>Ready to streamline your practice?</h4>
              <p>Let NEXA24 handle the complexity, so you can focus on care.</p>
            </div>
          </div>
          <a className="btn-primary cta-btn" href="#contact">
            Contact Us
            <ArrowRight size={16} style={{ display: "inline", verticalAlign: "-2px", marginLeft: 8 }} />
          </a>
        </div>
      </section>
    </div>
  );
}