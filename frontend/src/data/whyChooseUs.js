// Single source of truth for the "Why Choose NEXA24" cards.
//
// Previously this content was duplicated in three different places with
// three different sets of cards: Advantage.jsx (Home page) had its own
// hardcoded 4 cards, ServiceDetail.jsx had yet another hardcoded set, and
// AboutUs.jsx had its own separate 5-card list. This is the actual content
// (the AboutUs 5-card version) — every page now pulls from here, so editing
// one place updates the "Why Choose Us" cards everywhere they're shown.
import { Clock, Award, ShieldCheck, HeartHandshake, Layers } from "lucide-react";

const WHY_CHOOSE_US = [
    {
        title: "24/7 Support",
        description: "We work while you sleep.",
        Icon: Clock,
    },
    {
        title: "Healthcare Experts",
        description: "Team with real billing + credentialing experience.",
        Icon: Award,
    },
    {
        title: "HIPAA Compliant",
        description: "Your data security is our priority.",
        Icon: ShieldCheck,
    },
    {
        title: "One Partner, All Solutions",
        description: "No need to juggle multiple vendors.",
        Icon: HeartHandshake,
    },
    {
        title: "Scalable",
        description: "Services that grow with your practice.",
        Icon: Layers,
    },
];

export default WHY_CHOOSE_US;