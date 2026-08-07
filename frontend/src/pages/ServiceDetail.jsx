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

  "medical-billing-services": {
    eyebrow: "MEDICAL BILLING SERVICES",
    title: "Medical Billing.",
    highlightTitle: "Maximized Revenue.",
    description:
      "Complete Revenue Cycle Management designed to maximize reimbursements and reduce denials. From claims submission to payment posting, we handle every step with accuracy and speed.",
    benefit: "Faster payments, fewer denials, and a healthier bottom line.",
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
    badges: [
      { text: "Claims Submission", Icon: FileCheck2 },
      { text: "Denial Management", Icon: ShieldCheck },
      { text: "Payment Posting", Icon: DollarSign },
      { text: "Eligibility Verification", Icon: UserCheck },
      { text: "Revenue Reporting", Icon: TrendingUp },
    ],
    handlesHeading: "What Our Billing Team Handles",
    handles: [
      { Icon: FileCheck2, title: "Claims Submission & Follow-up", desc: "Accurate, timely claim filing with active tracking until paid." },
      { Icon: ShieldCheck, title: "Denial Management & Appeals", desc: "We identify, correct, and appeal denied claims quickly." },
      { Icon: DollarSign, title: "Payment Posting & Reconciliation", desc: "Precise posting of payments and adjustments to keep books clean." },
      { Icon: UserCheck, title: "Insurance Eligibility Verification", desc: "Verify coverage upfront to prevent avoidable denials." },
      { Icon: TrendingUp, title: "Revenue Cycle Reporting", desc: "Clear, actionable reports on your practice's financial health." },
    ],
    process: [
      { num: "01", Icon: MessageSquare, title: "Assess", desc: "We review your current billing workflow and gaps." },
      { num: "02", Icon: UserPlus, title: "Set Up", desc: "We configure billing processes matched to your practice." },
      { num: "03", Icon: Rocket, title: "Submit & Track", desc: "Claims go out fast and are tracked to resolution." },
      { num: "04", Icon: TrendingUp, title: "Optimize", desc: "We continuously improve collections and reduce denials." },
    ],
    whyHeading: "Why Practices Choose NEXA24",
    whyCards: [
      { Icon: DollarSign, title: "Faster Reimbursements", desc: "Get paid quicker with clean, accurate claims." },
      { Icon: ShieldCheck, title: "Reduced Denials", desc: "Proactive checks catch issues before submission." },
      { Icon: Lock, title: "HIPAA Compliant", desc: "Security and privacy built into every process." },
      { Icon: UsersRound, title: "Certified Billing Experts", desc: "Experienced RCM specialists managing your revenue." },
    ],
    ctaTitle: "Ready to maximize your reimbursements?",
    ctaDesc: "Let our billing experts streamline your revenue cycle from claim to payment.",
  },

  "credentialing-services": {
    eyebrow: "CREDENTIALING SERVICES",
    title: "Credentialing.",
    highlightTitle: "Made Simple.",
    description:
      "Get providers enrolled and paid faster. We handle the entire credentialing lifecycle with accuracy and speed, so you never miss a payer deadline.",
    benefit: "Faster enrollments, fewer delays, and providers who can start billing sooner.",
    heroImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
    badges: [
      { text: "Payer Enrollment", Icon: FileCheck2 },
      { text: "CAQH Management", Icon: ShieldCheck },
      { text: "Re-credentialing", Icon: Calendar },
      { text: "Application Tracking", Icon: UserCheck },
      { text: "Contract Support", Icon: UsersRound },
    ],
    handlesHeading: "What Our Credentialing Team Handles",
    handles: [
      { Icon: FileCheck2, title: "Payer Enrollment", desc: "Complete enrollment with commercial and government payers." },
      { Icon: ShieldCheck, title: "CAQH Profile Management", desc: "We keep your CAQH profile accurate and current." },
      { Icon: Calendar, title: "Re-credentialing & Renewals", desc: "Never miss a renewal deadline or lapse in participation." },
      { Icon: UserCheck, title: "Application Tracking", desc: "Full visibility into every application's status." },
      { Icon: UsersRound, title: "Contract Negotiation Support", desc: "Guidance through payer contract terms and rates." },
    ],
    process: [
      { num: "01", Icon: MessageSquare, title: "Gather", desc: "We collect provider documents and credentials." },
      { num: "02", Icon: UserPlus, title: "Submit", desc: "Applications go out to every required payer." },
      { num: "03", Icon: Rocket, title: "Track", desc: "We follow up until each application is approved." },
      { num: "04", Icon: TrendingUp, title: "Maintain", desc: "We manage renewals so status never lapses." },
    ],
    whyHeading: "Why Practices Choose NEXA24",
    whyCards: [
      { Icon: Clock, title: "Faster Enrollment", desc: "Reduced turnaround time with every payer." },
      { Icon: ShieldCheck, title: "Fewer Delays", desc: "Proactive tracking prevents missed deadlines." },
      { Icon: Lock, title: "HIPAA Compliant", desc: "Your provider data is always handled securely." },
      { Icon: UsersRound, title: "Dedicated Specialists", desc: "Credentialing experts who know every payer's process." },
    ],
    ctaTitle: "Ready to get your providers credentialed faster?",
    ctaDesc: "Let NEXA24 manage the entire credentialing process end-to-end.",
  },

  "marketing-services": {
    eyebrow: "MARKETING SERVICES",
    title: "Practice Marketing.",
    highlightTitle: "Real Growth.",
    description:
      "Grow your practice online and attract more patients. We build your brand so you stand out — from your website to your social presence.",
    benefit: "More visibility, more patients, and a brand that reflects your quality of care.",
    heroImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    badges: [
      { text: "Website & SEO", Icon: TrendingUp },
      { text: "Social Media", Icon: UsersRound },
      { text: "Google Business Profile", Icon: Calendar },
      { text: "Review Management", Icon: UserCheck },
      { text: "Branding & Content", Icon: FileCheck2 },
    ],
    handlesHeading: "What Our Marketing Team Handles",
    handles: [
      { Icon: TrendingUp, title: "Website & SEO", desc: "A modern site optimized to rank and convert visitors." },
      { Icon: UsersRound, title: "Social Media Management", desc: "Consistent, engaging content across your channels." },
      { Icon: Calendar, title: "Google Business Profile", desc: "Optimized local listings to bring in nearby patients." },
      { Icon: UserCheck, title: "Patient Review Management", desc: "Build trust with a strong, well-managed review presence." },
      { Icon: FileCheck2, title: "Content & Branding", desc: "Cohesive messaging that reflects your practice's identity." },
    ],
    process: [
      { num: "01", Icon: MessageSquare, title: "Discover", desc: "We learn your practice, patients, and goals." },
      { num: "02", Icon: UserPlus, title: "Strategize", desc: "We build a marketing plan tailored to your growth." },
      { num: "03", Icon: Rocket, title: "Launch", desc: "Campaigns and content go live across channels." },
      { num: "04", Icon: TrendingUp, title: "Grow", desc: "We track performance and scale what works." },
    ],
    whyHeading: "Why Practices Choose NEXA24",
    whyCards: [
      { Icon: UsersRound, title: "More Patients", desc: "Marketing built to fill your schedule, not just impressions." },
      { Icon: TrendingUp, title: "Stronger Brand", desc: "A consistent, professional presence everywhere patients look." },
      { Icon: DollarSign, title: "Data-Driven", desc: "Decisions backed by real performance metrics." },
      { Icon: Lock, title: "Dedicated Team", desc: "A marketing partner that knows healthcare." },
    ],
    ctaTitle: "Ready to grow your patient base?",
    ctaDesc: "Let NEXA24 build a brand and marketing engine that brings patients in.",
  },

  "additional-billing-rcm-solutions": {
    eyebrow: "ADDITIONAL BILLING & RCM SOLUTIONS",
    title: "Specialized Billing",
    highlightTitle: "& RCM Support.",
    description:
      "Need support in specific areas? We've got you. Prior authorization, patient statements, collections, denial analysis & custom reports — handled with precision.",
    benefit: "Targeted support that fills the gaps in your revenue cycle.",
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    badges: [
      { text: "Prior Authorization", Icon: ShieldCheck },
      { text: "Patient Statements", Icon: FileCheck2 },
      { text: "Collections Support", Icon: DollarSign },
      { text: "Denial Analysis", Icon: TrendingUp },
      { text: "Custom Reports", Icon: UserCheck },
    ],
    handlesHeading: "What Our RCM Team Handles",
    handles: [
      { Icon: ShieldCheck, title: "Prior Authorization", desc: "Timely authorization requests to avoid treatment delays." },
      { Icon: FileCheck2, title: "Patient Statements", desc: "Clear, accurate statements that reduce billing confusion." },
      { Icon: DollarSign, title: "Collections Support", desc: "Respectful, effective follow-up on outstanding balances." },
      { Icon: TrendingUp, title: "Denial Analysis", desc: "Root-cause analysis to prevent recurring denials." },
      { Icon: UserCheck, title: "Custom Reports", desc: "Reporting built around the metrics that matter to you." },
    ],
    process: [
      { num: "01", Icon: MessageSquare, title: "Identify", desc: "We pinpoint the exact gaps in your revenue cycle." },
      { num: "02", Icon: UserPlus, title: "Customize", desc: "We build a solution around your specific needs." },
      { num: "03", Icon: Rocket, title: "Implement", desc: "Support goes live with minimal disruption." },
      { num: "04", Icon: TrendingUp, title: "Refine", desc: "We adjust and improve based on ongoing results." },
    ],
    whyHeading: "Why Practices Choose NEXA24",
    whyCards: [
      { Icon: ShieldCheck, title: "Targeted Support", desc: "Help exactly where your revenue cycle needs it most." },
      { Icon: Clock, title: "Faster Resolutions", desc: "Quicker turnaround on authorizations and appeals." },
      { Icon: Lock, title: "HIPAA Compliant", desc: "Patient and financial data handled securely." },
      { Icon: UsersRound, title: "Flexible Team", desc: "Specialists who adapt to your practice's unique needs." },
    ],
    ctaTitle: "Need extra support with your revenue cycle?",
    ctaDesc: "Let NEXA24 fill the gaps with precise, dedicated RCM support.",
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
              {data.title} <br /><span>{data.highlightTitle}</span>
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
        <h2 className="section-heading text-center reveal">{data.handlesHeading}</h2>

        <div className="handles-grid">
          {data.handles.map((item, idx) => {
            const ItemIcon = item.Icon;
            return (
              <div
                key={idx}
                className="service-card handle-card reveal"
                style={{ transitionDelay: `${idx * 90}ms` }}
              >
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
        <h2 className="section-heading text-center reveal">Our Simple Process</h2>

        <div className="how-steps-grid">
          {data.process.map((step, idx) => {
            const StepIcon = step.Icon;
            return (
              <div
                className="how-step-card reveal"
                key={idx}
                style={{ transitionDelay: `${idx * 110}ms` }}
              >
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
        <h2 className="section-heading text-center reveal">{data.whyHeading}</h2>

        <div className="why-grid-4">
          {data.whyCards.map((item, idx) => {
            const CardIcon = item.Icon;
            return (
              <div
                className="why-card reveal"
                key={idx}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
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