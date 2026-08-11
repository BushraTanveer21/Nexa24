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
import WHY_CHOOSE_US from "../data/whyChooseUs";
import { resolveIcon } from "../utils/iconMap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Detailed service definitions matching the mockup design
const SERVICE_DETAILS = {
  "virtual-assistance-services": {
    eyebrow: "VIRTUAL ASSISTANCE SERVICES",
    title: "Virtual Assistance",
    description:
      "Free your staff from admin work. Our trained healthcare VAs handle scheduling, patient follow-ups, prior authorizations, charting support, and front-desk tasks remotely.",
    heroImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    badges: [],
    handlesHeading: "What Our Virtual Assistants Handle",
    handles: [],
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
    title: "Medical Billing",
    description:
      "Complete Revenue Cycle Management designed to maximize reimbursements and reduce denials. From claims submission to payment posting, we handle every step with accuracy and speed.",
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
    badges: [],
    handlesHeading: "What Our Billing Team Handles",
    handles: [],
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
    title: "Credentialing",
    description:
      "Get providers enrolled and paid faster. We handle the entire credentialing lifecycle with accuracy and speed, so you never miss a payer deadline.",
    heroImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
    badges: [],
    handlesHeading: "What Our Credentialing Team Handles",
    handles: [],
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
    title: "Practice Marketing",
    description:
      "Grow your practice online and attract more patients. We build your brand so you stand out — from your website to your social presence.",
    heroImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    badges: [],
    handlesHeading: "What Our Marketing Team Handles",
    handles: [],
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
    description:
      "Need support in specific areas? We've got you. Prior authorization, patient statements, collections, denial analysis & custom reports — handled with precision.",
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    badges: [],
    handlesHeading: "What Our RCM Team Handles",
    handles: [],
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

// Fallback generator for dynamically added backend services (used when the
// slug isn't one of the 5 hand-designed entries above)
function buildFallbackServiceData(backendService) {
  const name = backendService?.title || backendService?.name || "Healthcare Service";
  return {
    eyebrow: name.toUpperCase(),
    title: name,
    description:
      backendService?.description ||
      "Streamline your healthcare practice operations with NEXA24's dedicated managed solutions.",
    heroImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    badges: [],
    handlesHeading: `What Our ${name} Team Handles`,
    handles: [],
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

// Builds the final data used to render the page. Starts from either the
// hand-designed content (for the 5 core services) or the generic fallback
// (for any service added later from the admin panel), then layers the
// real backend title/description/benefits on top — so nothing on the page
// stays hardcoded once the admin has entered the real data.
function getServiceData(slug, backendService) {
  const base = SERVICE_DETAILS[slug]
    ? { ...SERVICE_DETAILS[slug] }
    : buildFallbackServiceData(backendService);

  // Title, eyebrow, and description now always come from the real service
  // record in the DB — not the hardcoded SERVICE_DETAILS copy. Eyebrow is
  // just the title in caps, so there's no separate field to keep in sync.
  if (backendService?.title?.trim()) {
    base.title = backendService.title.trim();
    base.eyebrow = backendService.title.trim().toUpperCase();
  }
  if (backendService?.description?.trim()) {
    base.description = backendService.description.trim();
  }

  // Benefits entered in the admin dashboard drive BOTH the pill row under the
  // title AND the "What Our ... Handle" cards further down the page — they
  // used to only feed the pills, so anything an admin added never showed up
  // in the cards below. Building both from the same array also keeps them in
  // the same order, so a pill and its matching card share an index.
  if (Array.isArray(backendService?.benefits) && backendService.benefits.length > 0) {
    const validBenefits = backendService.benefits.filter((b) => b?.label?.trim());

    base.badges = validBenefits.map((b) => ({
      text: b.label.trim(),
      Icon: resolveIcon(b.icon, b.label),
    }));

    base.handles = validBenefits.map((b) => ({
      Icon: resolveIcon(b.icon, b.label),
      title: b.label.trim(),
      desc: b.description?.trim() || "Handled by our trained NEXA24 team as part of this service.",
    }));
  }

  return base;
}

// DOM id for a "What We Handle" card, keyed by its POSITION in the list
// (not its text). Badges and handles are always built in the same order —
// pill #1 pairs with card #1, pill #2 with card #2, etc. — so matching by
// index works even when a badge's short label doesn't exactly match its
// card's longer title (e.g. "Claims Submission" pill vs "Claims Submission
// & Follow-up" card). This also means any newly added service/benefit pair
// just works automatically, since it's positional, not text-based.
const handleId = (idx) => `handle-${idx}`;

export default function ServiceDetail() {
  const { slug } = useParams();
  const [backendService, setBackendService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clicking a purple benefit pill just scrolls the page down to its
  // matching card (same position) in "What Our ... Handle" — nothing else.
  // scroll-margin-top on .handle-card (App.css) keeps the card clear of the
  // fixed header once it lands.
  const scrollToHandle = (idx) => {
    const el = document.getElementById(handleId(idx));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  // A slug is only "real" if it's one of the 5 hand-designed services OR it
  // matched an actual service record from the backend. Anything else (a
  // mistyped/old/bookmarked URL, or a slug that was never properly built
  // with slugify()) used to silently render fake "Healthcare Service"
  // placeholder content via buildFallbackServiceData — this made a broken
  // link look like a real page instead of telling the visitor it doesn't
  // exist.
  const isKnownSlug = Boolean(SERVICE_DETAILS[slug]);
  const notFound = !loading && !isKnownSlug && !backendService;

  const data = getServiceData(slug, backendService);
  // Prefer the real image uploaded in the admin panel (Cloudinary URL) over
  // the generic stock photo, when one has actually been uploaded for this
  // service.
  if (backendService?.image) {
    data.heroImage = backendService.image;
  }
  useScrollReveal([loading, slug]);

  if (notFound) {
    return (
      <div className="main-wrapper">
        <section
          className="hero-wrap"
          style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}
        >
          <div
            className="hero-content reveal"
            style={{ textAlign: "center", margin: "0 auto" }}
          >
            <span className="eyebrow" style={{ justifyContent: "center" }}>
              <span className="dot" />
              SERVICE NOT FOUND
            </span>
            <h1>This service doesn't exist</h1>
            <p>
              The service you're looking for may have been removed, renamed,
              or the link is incorrect.
            </p>
            <div className="hero-ctas" style={{ justifyContent: "center" }}>
              <Link to="/services" className="btn-primary">
                Back to Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            {data.badges && data.badges.length > 0 && (
              <div className="detail-badges-row">
                {data.badges.map((badge, idx) => {
                  const BadgeIcon = badge.Icon;
                  return (
                    <button
                      type="button"
                      className="detail-badge-pill"
                      key={idx}
                      onClick={() => scrollToHandle(idx)}
                    >
                      <BadgeIcon size={14} />
                      {badge.text}
                    </button>
                  );
                })}
              </div>
            )}
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

      {/* ===== WHAT WE HANDLE SECTION =====
          Only rendered once the admin has added real benefits for this
          service — no hardcoded fallback content is shown. */}
      {data.handles && data.handles.length > 0 && (
        <section className="services-section">
          <h2 className="section-heading text-center reveal">{data.handlesHeading}</h2>

          <div className="handles-grid">
            {data.handles.map((item, idx) => {
              const ItemIcon = item.Icon;
              return (
                <div
                  key={idx}
                  id={handleId(idx)}
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
      )}

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

      {/* ===== WHY PRACTICES CHOOSE NEXA24 SECTION =====
          Reuses the exact same cards shown on the About Us / Home page
          (frontend/src/data/whyChooseUs.js) instead of a separate,
          per-service hardcoded list — one place to edit, shown everywhere. */}
      <section className="why-section">
        <h2 className="section-heading text-center reveal">Why Choose NEXA24</h2>

        <div className="why-grid-4">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div
              className="why-card reveal"
              key={item.title}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="why-icon">
                <item.Icon size={22} />
              </div>
              <div className="why-card-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
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
              <h4>{data.ctaTitle}</h4>
              <p>{data.ctaDesc}</p>
            </div>
          </div>
          <Link className="btn-primary cta-btn" to="/contact#contact-form">
            Schedule a Consultation
            <ArrowRight size={16} style={{ display: "inline", verticalAlign: "-2px", marginLeft: 8 }} />
          </Link>
        </div>
      </section>
    </div>
  );
}