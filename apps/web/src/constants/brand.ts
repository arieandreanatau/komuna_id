export const BRAND = {
  name: "KomunaID",
  tagline: "CONNECT • COMMUNITY • GROW",
  subtitle: "Terhubung. Bergerak. Bertumbuh Bersama.",
  description:
    "Temukan komunitas, ikut event, dan berkolaborasi dalam satu ekosistem yang menghubungkan member, komunitas, organisasi, dan brand.",
  colors: {
    navy: "#0A2A66",
    blue: "#1478FF",
    teal: "#00B8A9",
    aqua: "#00D4C6",
    orange: "#FF9A1A",
    lightGray: "#F5F7FA",
  },
  social: {
    instagram: "#",
    twitter: "#",
    linkedin: "#",
    facebook: "#",
  },
  stats: {
    members: "10K+",
    communities: "500+",
    events: "1.000+",
    articles: "2.500+",
  },
} as const;

export const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Komunitas", href: "/communities" },
  { label: "Event", href: "/events" },
  { label: "Artikel", href: "/articles" },
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/contact" },
] as const;

export const COMMUNITY_CATEGORIES = [
  { name: "Teknologi", slug: "teknologi", icon: "cpu" },
  { name: "Lingkungan", slug: "lingkungan", icon: "leaf" },
  { name: "Kesehatan", slug: "kesehatan", icon: "heart-pulse" },
  { name: "Pendidikan", slug: "pendidikan", icon: "graduation-cap" },
  { name: "Sosial", slug: "sosial", icon: "users" },
  { name: "Bisnis", slug: "bisnis", icon: "briefcase" },
  { name: "Seni & Budaya", slug: "seni-budaya", icon: "palette" },
  { name: "Olahraga", slug: "olahraga", icon: "trophy" },
] as const;

export const FEATURE_LINKS = [
  { label: "Komunitas", href: "/communities", icon: "users", color: "brand-blue" },
  { label: "Event", href: "/events", icon: "calendar", color: "brand-teal" },
  { label: "Artikel", href: "/articles", icon: "file-text", color: "brand-aqua" },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: "shopping-bag", color: "brand-orange" },
] as const;
