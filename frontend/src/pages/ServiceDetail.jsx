import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  PhoneCall,
  Clock,
  DollarSign,
  UsersRound,
  Lock,
  ArrowRight,
  MessageSquare,
  UserPlus,
  Rocket,
  TrendingUp,
} from "lucide-react";
import branchTL from "../assets/botanical-branch-tl.png";
import nexaLogo from "../assets/nexa24-logo.png";
import useScrollReveal from "../hooks/useScrollReveal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Detailed service definitions matching the mockup design
const SERVICE_DETAILS = {
  "virtual-assistance-services": {
    eyebrow: "VIRTUAL ASSISTANCE SERVICES",
    title: "Virtual Assistance.",
    highlightTitle: "Real Impact.",
    description:
      "Free your staff from admin work. Our trained healthcare VAs handle scheduling, patient follow-ups, prior authorizations, charting support, and front-desk tasks remotely.",
    benefit: "Save time, reduce overhead, and keep your practice running smoothly.",
    heroImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    badges: [
      { text: "Scheduling & Appointments", Icon: Calendar },
      { text: "Patient Follow-ups", Icon: UserCheck },
      { text: "Prior Authorizations", Icon: ShieldCheck },
      { text: "Charting Support", Icon: FileCheck2 },
      { text: "Front-desk Support", Icon: PhoneCall },
    ],
    handlesHeading: "What Our Virtual Assistants Handle",
    handles: [
      {
        Icon: Calendar,
        title: "Scheduling & Appointments",
        desc: "Manage calendars, book appointments, and reduce no-shows.",
      },
      {
        Icon: UserCheck,
        title: "Patient Follow-ups",
        desc: "Handle reminders, follow-ups, and patient communication.",
      },
      {
        Icon: ShieldCheck,
        title: "Prior Authorizations",
        desc: "Verify eligibility and manage prior auth requests efficiently.",
      },
      {
        Icon: FileCheck2,
        title: "Charting Support",
        desc: "Update records, manage EHR tasks, and ensure accurate documentation.",
      },
      {
        Icon: PhoneCall,
        title: "Front-desk Support",
        desc: "Answer calls, manage inboxes, and handle day-to-day inquiries.",
      },
    ],
    process: [
      { num: "01", Icon: MessageSquare, title: "Understand", desc: "We learn your workflow and requirements." },
      { num: "02", Icon: UserPlus, title: "Assign", desc: "We match you with the right trained VA." },
      { num: "03", Icon: Rocket, title: "Onboard", desc: "We integrate and train the VA for your practice." },
      { num: "04", Icon: TrendingUp, title: "Support & Scale", desc: "We support, optimize, and grow with you." },
    ],
    whyHeading: "Why Practices Choose NEXA24",
    whyCards: [
      { Icon: DollarSign, title: "Reduce Overhead", desc: "Lower staffing costs without compromising productivity." },
      { Icon: Clock, title: "Save Time", desc: "Focus on patients while we handle time-consuming tasks." },
      { Icon: Lock, title: "HIPAA Compliant", desc: "Security and privacy built into every process." },
      { Icon: UsersRound, title: "Skilled & Reliable", desc: "Trained healthcare professionals you can count on." },
    ],
    ctaTitle: "Ready to simplify your operations?",
    ctaDesc: "Let our virtual assistants handle the busywork so you can focus on care.",
  },
};

// Fallback generator for dynamically added backend services
function getServiceData(slug, backendService) {
  if (SERVICE_DETAILS[slug]) {
    return SERVICE_DETAILS[slug];
  }

  const name = backendService?.title || backendService?.name || "Healthcare Service";
  return {
    eyebrow: name.toUpperCase(),
    title: `${name}.`,
    highlightTitle: "Real Results.",
    description:
      backendService?.description ||
      "Streamline your healthcare practice operations with NEXA24's dedicated managed solutions.",
    benefit: "Maximized efficiency, clean workflows, and seamless patient satisfaction.",
    heroImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    badges: [
      { text: "Seamless Workflow", Icon: Calendar },
      { text: "HIPAA Compliant", Icon: Lock },
      { text: "Dedicated Team", Icon: UsersRound },
      { text: "24/7 Vigilance", Icon: ShieldCheck },
    ],
    handlesHeading: `What Our ${name} Team Handles`,
    handles: [
      { Icon: Calendar, title: "Workflow Management", desc: "End-to-end management tailored to your practice." },
      { Icon: ShieldCheck, title: "Quality Assurance", desc: "Thorough verification and compliance checks." },
      { Icon: Clock, title: "Time Optimization", desc: "Faster processing times and reduced administrative burden." },
      { Icon: UsersRound, title: "Dedicated Support", desc: "Direct access to skilled healthcare specialists." },
    ],
    process: [
      { num: "01", Icon: MessageSquare, title: "Consult", desc: "We analyze your specific practice needs." },
      { num: "02", Icon: UserPlus, title: "Setup", desc: "Customized workflow design and setup." },
      { num: "03", Icon: Rocket, title: "Launch", desc: "Seamless onboarding with minimal downtime." },
      { num: "04", Icon: TrendingUp, title: "Optimize", desc: "Continuous monitoring and performance scaling." },
    ],
    whyHeading: "Why Practices Choose NEXA24",
    whyCards: [
      { Icon: DollarSign, title: "Reduce Overhead", desc: "Lower operational costs without sacrificing quality." },
      { Icon: Clock, title: "Save Time", desc: "Free up clinical hours for direct patient care." },
      { Icon: Lock, title: "HIPAA Compliant", desc: "Rigorous data security and privacy protocols." },
      { Icon: UsersRound, title: "Skilled & Reliable", desc: "Expert healthcare professionals dedicated to your growth." },
    ],
    ctaTitle: `Ready to elevate your practice with ${name}?`,
    ctaDesc: "Let NEXA24 handle the operational complexity so you can focus on care.",
  };
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const [backendService, setBackendService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchService = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const found = data.find(
              (s) =>
                (s.title || s.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") === slug
            );
            if (!cancelled && found) setBackendService(found);
          }
        }
      } catch (err) {
        console.warn("Backend fetch failed for detail page:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchService();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const data = getServiceData(slug, backendService);
  // Prefer the real image uploaded in the admin panel (Cloudinary URL) over
  // the generic stock photo, when one has actually been uploaded for this
  // service.
  if (backendService?.image) {
    data.heroImage = backendService.image;
  }
  useScrollReveal([loading, slug]);

  return (
    <div className="main-wrapper">
      {/* Botanical Background Accent Leaf Branches */}
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-tl" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-mr" />
      <img src={branchTL} alt="" aria-hidden="true" className="botanical-branch hero-branch-br" />

      {/* ===== HERO SECTION ===== */}
      <section className="hero-wrap service-detail-hero">
        <div className="hero-inner">
          <div className="hero-content reveal">
            <span className="eyebrow">
              <span className="dot" />
              {data.eyebrow}
            </span>
            <h1>
              {data.title} <span>{data.highlightTitle}</span>
            </h1>
            <p>{data.description}</p>
          </div>

          {/* Hero Visual — professional framed photo, full image visible */}
          <div className="detail-hero-visual reveal">
            {!loading && (
              <div className="detail-photo-wrapper">
                <img src={data.heroImage} alt={data.title} className="detail-hero-photo" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE HANDLE SECTION ===== */}
      <section className="services-section">
        <h2 className="section-heading text-center">{data.handlesHeading}</h2>

        <div className="handles-grid">
          {data.handles.map((item, idx) => {
            const ItemIcon = item.Icon;
            return (
              <div key={idx} className="service-card handle-card reveal">
                <div className="service-card-icon">
                  <ItemIcon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== OUR SIMPLE PROCESS SECTION ===== */}
      <section className="how-section">
        <h2 className="section-heading text-center">Our Simple Process</h2>

        <div className="how-steps-grid">
          {data.process.map((step, idx) => {
            const StepIcon = step.Icon;
            return (
              <div className="how-step-card reveal" key={idx}>
                <div className="how-card-top">
                  <div className="how-icon">
                    <StepIcon size={22} />
                  </div>
                  <div className="how-step-badge">{step.num}</div>
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== WHY PRACTICES CHOOSE NEXA24 SECTION ===== */}
      <section className="why-section">
        <h2 className="section-heading text-center">{data.whyHeading}</h2>

        <div className="why-grid-4">
          {data.whyCards.map((item, idx) => {
            const CardIcon = item.Icon;
            return (
              <div className="why-card reveal" key={idx}>
                <div className="why-icon">
                  <CardIcon size={22} />
                </div>
                <div className="why-card-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            );
          })}
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
              <h4>{data.ctaTitle}</h4>
              <p>{data.ctaDesc}</p>
            </div>
          </div>
          <a className="btn-primary cta-btn" href="#contact">
            Schedule a Consultation
            <ArrowRight size={16} style={{ display: "inline", verticalAlign: "-2px", marginLeft: 8 }} />
          </a>
        </div>
      </section>
    </div>
  );
}