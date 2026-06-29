export const BRAND = {
  name: "KomunaID",
  tagline: "CONNECT • COMMUNITY • GROW",
  description:
    "Platform untuk Terhubung, Bergerak, dan Bertumbuh.",
  colors: {
    navy: "#0A2A66",
    blue: "#1478FF",
    teal: "#00B8A9",
    aqua: "#00D4C6",
    orange: "#FF9A1A",
    lightGray: "#F5F7FA",
  },
  social: {
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
  },
} as const;

export const NAV_LINKS = [
  { label: "Komunitas", href: "/communities" },
  { label: "Event", href: "/events" },
  { label: "Artikel", href: "/articles" },
  { label: "Tentang", href: "/about" },
] as const;
