"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  MapPin, Star, Users, Wifi, Car, Coffee, Calendar, Clock, ChevronLeft,
  Check, Camera, Phone, Mail, MessageSquare, ThumbsUp, Quote, Building2
} from "lucide-react";

const MOCK_VENUE = {
  name: "Gedung Serbaguna TechPark",
  slug: "gedung-serbaguna-techpark",
  location: "Jl. TB Simatupang No. 88, Jakarta Selatan",
  rating: 4.8,
  reviewCount: 124,
  capacity: 200,
  pricePerHour: 5000000,
  category: "Aula & Gedung",
  description:
    "Gedung serbaguna modern dengan fasilitas lengkap untuk berbagai jenis event. Cocok untuk seminar, workshop, meetup, hingga acara komunitas berskala besar. Dilengkapi dengan sound system profesional, proyektor HD, dan tim support yang berpengalaman.",
  facilities: ["WiFi High-Speed", "Parkir Luas", "AC Central", "Sound System", "Proyektor HD", "Panggung", "Ruang Ganti", "Catering Area"],
  gallery: [null, null, null, null, null, null],
  reviews: [
    { id: 1, name: "Rina Sari", rating: 5, date: "25 Jun 2026", comment: "Venue yang sangat bagus! Fasilitas lengkap dan tim support sangat membantu." },
    { id: 2, name: "Dimas Prayoga", rating: 4, date: "18 Jun 2026", comment: "Tempat yang nyaman untuk workshop. Harga sesuai dengan fasilitas yang didapat." },
    { id: 3, name: "Maya Putri", rating: 5, date: "10 Jun 2026", comment: "Sangat recommended untuk event komunitas. Lokasi strategis dan mudah diakses." },
  ],
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function VenueDetailPage() {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");
  const [duration, setDuration] = useState(2);

  const totalPrice = MOCK_VENUE.pricePerHour * duration;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/venue" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand-navy mb-6">
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Direktori Venue
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
                      {MOCK_VENUE.category}
                    </span>
                    <h1 className="mt-3 text-3xl font-bold text-brand-navy">{MOCK_VENUE.name}</h1>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {MOCK_VENUE.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                        <span className="text-sm font-semibold text-brand-navy">{MOCK_VENUE.rating}</span>
                        <span className="text-sm text-muted-foreground">({MOCK_VENUE.reviewCount} ulasan)</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-brand-blue">{formatPrice(MOCK_VENUE.pricePerHour)}<span className="text-sm font-normal text-muted-foreground">/jam</span></span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex items-center gap-2 rounded-xl bg-brand-light-gray p-3">
                    <Users className="h-5 w-5 text-brand-blue" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kapasitas</p>
                      <p className="text-sm font-semibold text-brand-navy">{MOCK_VENUE.capacity} orang</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-brand-light-gray p-3">
                    <Star className="h-5 w-5 text-brand-orange" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-sm font-semibold text-brand-navy">{MOCK_VENUE.rating}/5.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-brand-light-gray p-3">
                    <MapPin className="h-5 w-5 text-brand-teal" />
                    <div>
                      <p className="text-xs text-muted-foreground">Lokasi</p>
                      <p className="text-sm font-semibold text-brand-navy">Jakarta Selatan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-brand-light-gray p-3">
                    <Clock className="h-5 w-5 text-brand-aqua" />
                    <div>
                      <p className="text-xs text-muted-foreground">Jam Operasional</p>
                      <p className="text-sm font-semibold text-brand-navy">08:00 - 22:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Galeri</h2>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {MOCK_VENUE.gallery.map((_, idx) => (
                    <div key={idx} className="flex h-36 items-center justify-center rounded-xl bg-brand-light-gray transition-colors hover:bg-brand-blue/5">
                      <Camera className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Deskripsi</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{MOCK_VENUE.description}</p>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Fasilitas</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {MOCK_VENUE.facilities.map((facility) => (
                    <div key={facility} className="flex items-center gap-2 rounded-xl bg-brand-light-gray px-3 py-2.5">
                      <Check className="h-4 w-4 text-brand-teal" />
                      <span className="text-sm font-medium text-brand-navy">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-brand-navy">Ulasan ({MOCK_VENUE.reviews.length})</h2>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                    <span className="text-sm font-bold text-brand-navy">{MOCK_VENUE.rating}</span>
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  {MOCK_VENUE.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-brand-navy">{review.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-brand-orange text-brand-orange" : "text-gray-200"}`} />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="sticky top-6 rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Booking Venue</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-brand-navy">Tanggal</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-brand-light-gray px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-navy">Waktu Mulai</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-brand-light-gray px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    >
                      {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-navy">Durasi (jam)</label>
                    <div className="mt-1 flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((h) => (
                        <button
                          key={h}
                          onClick={() => setDuration(h)}
                          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                            duration === h
                              ? "bg-brand-blue text-white"
                              : "border border-border bg-white text-muted-foreground hover:bg-brand-light-gray"
                          }`}
                        >
                          {h}j
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{formatPrice(MOCK_VENUE.pricePerHour)} x {duration} jam</span>
                        <span className="text-brand-navy">{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Biaya admin</span>
                        <span className="text-brand-teal">GRATIS</span>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-brand-navy">Total</span>
                          <span className="text-xl font-bold text-brand-blue">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90">
                    Booking Sekarang
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-semibold text-brand-navy">Hubungi Pemilik</h3>
                <div className="mt-4 space-y-3">
                  <button className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium text-brand-navy hover:bg-brand-light-gray">
                    <Phone className="h-4 w-4 text-brand-blue" />
                    +62 812 3456 7890
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium text-brand-navy hover:bg-brand-light-gray">
                    <Mail className="h-4 w-4 text-brand-blue" />
                    info@techpark.id
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium text-brand-navy hover:bg-brand-light-gray">
                    <MessageSquare className="h-4 w-4 text-brand-blue" />
                    Kirim Pesan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
