"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Search, MapPin, Star, Map, Building2
} from "lucide-react";

const CATEGORIES = [
  "Semua Venue", "Aula & Gedung", "Ruang Meeting", "Lapangan Olahraga",
  "Outdoor Space", "Studio & Kreatif", "Cafe & Resto", "Coworking Space"
];

const MOCK_VENUES = [
  { id: 1, name: "Gedung Serbaguna TechPark", location: "Jakarta Selatan", rating: 4.8, price: 5000000, capacity: 200, category: "Aula & Gedung", facilities: ["WiFi", "Parkir", "AC", "Sound System"], image: null },
  { id: 2, name: "CoWork Space Hub Bandung", location: "Bandung", rating: 4.7, price: 500000, capacity: 30, category: "Coworking Space", facilities: ["WiFi", "Coffee", "Meeting Room"], image: null },
  { id: 3, name: "Studio Kreatif Surabaya", location: "Surabaya", rating: 4.6, price: 750000, capacity: 50, category: "Studio & Kreatif", facilities: ["WiFi", "Sound System", "Lighting"], image: null },
  { id: 4, name: "Taman Event Outdoor Bali", location: "Bali", rating: 4.9, price: 3000000, capacity: 150, category: "Outdoor Space", facilities: ["Parkir", "Area Terbuka", "Stage"], image: null },
  { id: 5, name: "Meeting Room Premium Jakarta", location: "Jakarta Pusat", rating: 4.5, price: 1000000, capacity: 20, category: "Ruang Meeting", facilities: ["WiFi", "Projector", "Whiteboard"], image: null },
  { id: 6, name: "Lapangan Futsal Komunitas", location: "Yogyakarta", rating: 4.4, price: 300000, capacity: 22, category: "Lapangan Olahraga", facilities: ["Lapangan", "Ruang Ganti", "Parkir"], image: null },
];

const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function VenuePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Venue");

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-teal py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Direktori Venue</h1>
            <p className="mt-2 text-white/80">Temukan venue terbaik untuk event komunitas Anda</p>
            <div className="mt-6 flex max-w-2xl gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari venue berdasarkan nama atau lokasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-aqua"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange/90">
                <Map className="h-4 w-4" />
                Lihat Peta
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-semibold text-brand-navy">Kategori</h3>
                <div className="mt-4 space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-brand-blue text-white"
                          : "text-muted-foreground hover:bg-brand-light-gray hover:text-brand-navy"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="text-sm text-muted-foreground">{MOCK_VENUES.length} venue ditemukan</p>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {MOCK_VENUES.map((venue) => (
                  <Link
                    key={venue.id}
                    href={`/venue/venue-${venue.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-brand-blue/20 hover:shadow-lg"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-brand-light-gray to-brand-blue/5 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-brand-blue/20" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy backdrop-blur-sm">
                        {venue.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-brand-navy group-hover:text-brand-blue">{venue.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {venue.location}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                        <span className="text-sm font-medium text-brand-navy">{venue.rating}</span>
                        <span className="text-xs text-muted-foreground">• {venue.capacity} orang</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {venue.facilities.slice(0, 3).map((f) => (
                          <span key={f} className="rounded-full bg-brand-light-gray px-2 py-0.5 text-xs text-muted-foreground">{f}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm text-muted-foreground">Mulai dari</span>
                        <span className="text-lg font-bold text-brand-navy">{formatPrice(venue.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}