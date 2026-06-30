import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND, COMMUNITY_CATEGORIES } from "@/constants";
import {
  Users, Calendar, ArrowRight, Search, MapPin, Star, ChevronRight,
  Heart, Globe, Zap, Shield, TrendingUp, BookOpen, Sparkles, Handshake
} from "lucide-react";

const FEATURES = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Temukan Komunitas",
    description: "Jelajahi ratusan komunitas dari berbagai kategori dan temukan yang paling sesuai dengan minat Anda.",
    color: "bg-brand-blue/10 text-brand-blue",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Ikuti Event",
    description: "Daftar event menarik dari komunitas Anda. Workshop, seminar, gathering, dan banyak lagi.",
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: "Berkolaborasi",
    description: "Bangun kolaborasi antar komunitas, organisasi, dan brand untuk dampak yang lebih besar.",
    color: "bg-brand-aqua/10 text-brand-aqua",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Bertumbuh Bersama",
    description: "Kembangkan potensi Anda dan komunitas melalui tools dan fitur yang tersedia.",
    color: "bg-brand-orange/10 text-brand-orange",
  },
];

const STATS = [
  { label: "Member Aktif", value: BRAND.stats.members, icon: <Users className="h-5 w-5" /> },
  { label: "Komunitas", value: BRAND.stats.communities, icon: <Globe className="h-5 w-5" /> },
  { label: "Event", value: BRAND.stats.events, icon: <Calendar className="h-5 w-5" /> },
  { label: "Artikel", value: BRAND.stats.articles, icon: <BookOpen className="h-5 w-5" /> },
];

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Workshop UI/UX Design Systems",
    date: "15 Jul 2026",
    time: "09:00 - 12:00",
    location: "Jakarta Selatan",
    community: "Komunitas Desain Indonesia",
    category: "Teknologi",
    isOnline: false,
    price: "Gratis",
    image: null,
  },
  {
    id: 2,
    title: "Tech Talk: AI & Machine Learning",
    date: "20 Jul 2026",
    time: "14:00 - 16:00",
    location: "Online",
    community: "ID Tech Community",
    category: "Teknologi",
    isOnline: true,
    price: "Rp 50.000",
    image: null,
  },
  {
    id: 3,
    title: "Community Gathering & Networking",
    date: "25 Jul 2026",
    time: "18:00 - 21:00",
    location: "Bandung",
    community: "Young Entrepreneur ID",
    category: "Bisnis",
    isOnline: false,
    price: "Rp 25.000",
    image: null,
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-blue to-brand-teal">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-aqua/30 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-brand-orange/20 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-aqua backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  Platform Ekosistem Komunitas
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Terhubung.{" "}
                  <span className="text-brand-aqua">Bergerak.</span>{" "}
                  Bertumbuh Bersama.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                  Temukan komunitas yang sesuai minat, ikut event menarik, dan
                  berkolaborasi dalam satu ekosistem yang menghubungkan Anda dengan
                  ribuan komunitas di seluruh Indonesia.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/communities"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-light-gray hover:shadow-xl"
                  >
                    Jelajahi Komunitas
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
                  >
                    Lihat Event
                  </Link>
                </div>
                <div className="mt-10 flex items-center gap-8">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-aqua/20 to-brand-orange/20 blur-2xl" />
                  <div className="relative rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: <Users className="h-8 w-8 text-brand-blue" />, label: "Komunitas Aktif", value: "500+" },
                        { icon: <Calendar className="h-8 w-8 text-brand-teal" />, label: "Event Bulanan", value: "200+" },
                        { icon: <Handshake className="h-8 w-8 text-brand-aqua" />, label: "Kolaborasi", value: "50+" },
                        { icon: <Star className="h-8 w-8 text-brand-orange" />, label: "Rating", value: "4.9" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl bg-white/10 p-5 text-center backdrop-blur-sm">
                          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                            {item.icon}
                          </div>
                          <p className="text-2xl font-bold text-white">{item.value}</p>
                          <p className="mt-1 text-xs text-white/70">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">
                Mengapa KomunaID?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Platform terlengkap untuk membangun dan mengelola ekosistem komunitas
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border bg-white p-8 transition-all hover:border-brand-blue/20 hover:shadow-lg"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-brand-navy">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Categories */}
        <section className="bg-brand-light-gray py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">
                  Jelajahi Kategori
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Temukan komunitas berdasarkan minat Anda
                </p>
              </div>
              <Link
                href="/communities"
                className="hidden items-center gap-2 text-sm font-semibold text-brand-blue hover:underline sm:flex"
              >
                Lihat Semua
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {COMMUNITY_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/communities?category=${cat.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-all hover:border-brand-blue/20 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">Komunitas aktif</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/communities"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
              >
                Lihat Semua Kategori
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">
                  Event Mendatang
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Jangan lewatkan event menarik dari komunitas kami
                </p>
              </div>
              <Link
                href="/events"
                className="hidden items-center gap-2 text-sm font-semibold text-brand-blue hover:underline sm:flex"
              >
                Lihat Semua
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_EVENTS.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/event-${event.id}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-brand-blue/20 hover:shadow-lg"
                >
                  <div className="relative h-48 bg-gradient-to-br from-brand-blue/20 to-brand-teal/20">
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white">
                        {event.category}
                      </span>
                      {event.isOnline && (
                        <span className="rounded-full bg-brand-teal px-3 py-1 text-xs font-semibold text-white">
                          Online
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 rounded-xl bg-white px-3 py-2 text-center shadow-sm">
                      <p className="text-xs font-medium text-brand-blue">{event.date.split(" ")[0]}</p>
                      <p className="text-lg font-bold text-brand-navy">{event.date.split(" ")[1]}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-brand-navy group-hover:text-brand-blue">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{event.community}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-sm font-semibold text-brand-navy">{event.price}</span>
                      <span className="text-sm font-medium text-brand-blue group-hover:underline">
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-brand-light-gray py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">
                Cara Kerja
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Mulai dalam 3 langkah sederhana
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Buat Akun",
                  description: "Daftar secara gratis dan lengkapi profil Anda untuk pengalaman yang dipersonalisasi.",
                  icon: <Zap className="h-6 w-6" />,
                },
                {
                  step: "02",
                  title: "Gabung Komunitas",
                  description: "Temukan dan bergabung dengan komunitas yang sesuai minat dan lokasi Anda.",
                  icon: <Users className="h-6 w-6" />,
                },
                {
                  step: "03",
                  title: "Mulai Aktivitas",
                  description: "Ikuti event, berkolaborasi, dan kembangkan potensi Anda bersama komunitas.",
                  icon: <Shield className="h-6 w-6" />,
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue text-white">
                    {item.icon}
                  </div>
                  <div className="mt-1 text-6xl font-bold text-brand-blue/10">{item.step}</div>
                  <h3 className="mt-2 text-xl font-semibold text-brand-navy">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">
                Apa Kata Mereka?
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  name: "Andi Pratama",
                  role: "Community Owner",
                  text: "KomunaID membantu komunitas kami bertumbuh dari 50 menjadi 500 member. Fitur event dan manajemen anggota sangat membantu!",
                },
                {
                  name: "Sari Dewi",
                  role: "Member",
                  text: "Saya menemukan banyak komunitas menarik di KomunaID. Sekarang saya aktif di 3 komunitas sekaligus.",
                },
                {
                  name: "Budi Santoso",
                  role: "Brand Partner",
                  text: "Kolaborasi dengan komunitas melalui KomunaID memberikan dampak positif yang luar biasa untuk brand kami.",
                },
              ].map((item) => (
                <div key={item.name} className="rounded-2xl border border-border bg-brand-light-gray p-8">
                  <div className="flex items-center gap-1 text-brand-orange">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-blue to-brand-teal py-20 sm:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-aqua/30 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-brand-orange/20 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Bangun Ekosistem Komunitas yang Lebih Kuat
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              Bergabunglah dengan ribuan komunitas dan mulai petualangan Anda
              di KomunaID hari ini.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-light-gray hover:shadow-xl"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/communities"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
              >
                Jelajahi Komunitas
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}