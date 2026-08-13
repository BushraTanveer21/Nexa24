










import {
    Calendar,
    Users,
    UsersRound,
    FileText,
    FileCheck2,
    ShieldCheck,
    Lock,
    Megaphone,
    DollarSign,
    Package,
    TrendingUp,
    Clock,
    UserCheck,
    PhoneCall,
    MessageSquare,
    Rocket,
    BarChart3,
    Check,
    Heart,
    Star,
    Award,
    Headset,
    Stethoscope,
    ClipboardCheck,
    Settings,
} from "lucide-react";

export const ICON_OPTIONS = [
    { key: "calendar", label: "Calendar", Icon: Calendar },
    { key: "users", label: "Users", Icon: Users },
    { key: "users-round", label: "Team", Icon: UsersRound },
    { key: "file-text", label: "Document", Icon: FileText },
    { key: "file-check", label: "Verified Document", Icon: FileCheck2 },
    { key: "shield", label: "Shield / Compliance", Icon: ShieldCheck },
    { key: "lock", label: "Lock / Security", Icon: Lock },
    { key: "megaphone", label: "Marketing", Icon: Megaphone },
    { key: "dollar", label: "Revenue / Billing", Icon: DollarSign },
    { key: "trending-up", label: "Growth", Icon: TrendingUp },
    { key: "clock", label: "Time / Speed", Icon: Clock },
    { key: "user-check", label: "Verification", Icon: UserCheck },
    { key: "phone", label: "Phone / Front Desk", Icon: PhoneCall },
    { key: "message", label: "Communication", Icon: MessageSquare },
    { key: "rocket", label: "Launch", Icon: Rocket },
    { key: "chart", label: "Analytics", Icon: BarChart3 },
    { key: "check", label: "Check / Done", Icon: Check },
    { key: "heart", label: "Care / Health", Icon: Heart },
    { key: "star", label: "Quality", Icon: Star },
    { key: "award", label: "Excellence", Icon: Award },
    { key: "headset", label: "24/7 Support", Icon: Headset },
    { key: "stethoscope", label: "Clinical", Icon: Stethoscope },
    { key: "clipboard", label: "Checklist", Icon: ClipboardCheck },
    { key: "settings", label: "Operations", Icon: Settings },
    { key: "package", label: "General / Other", Icon: Package },
];

const ICON_MAP = ICON_OPTIONS.reduce((acc, { key, Icon }) => {
    acc[key] = Icon;
    return acc;
}, {});




const KEYWORD_RULES = [
    { test: /virtual|assist|staff/i, key: "users" },
    { test: /billing|payment|revenue|rcm/i, key: "dollar" },
    { test: /credential/i, key: "shield" },
    { test: /marketing|brand|seo/i, key: "megaphone" },
    { test: /support|24\/7|available/i, key: "headset" },
    { test: /schedul|appointment|calendar/i, key: "calendar" },
    { test: /complian|hipaa|secur/i, key: "lock" },
    { test: /team|dedicat/i, key: "users-round" },
];

export function getIcon(key) {
    return ICON_MAP[key] || Package;
}



export function resolveIcon(iconKey, fallbackText = "") {
    if (iconKey && ICON_MAP[iconKey]) return ICON_MAP[iconKey];
    const match = KEYWORD_RULES.find((rule) => rule.test.test(fallbackText));
    return match ? ICON_MAP[match.key] : Package;
}