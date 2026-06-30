"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Search, Filter, Star, MapPin, Heart, Grid, List
} from "lucide-react";

const CATEGORIES = [
  "Semua", "Fashion", "Makanan & Minuman", "Kerajinan & Handmade",
  "Kesehatan & Kecantikan", "Elektronik", "Buku & Alat Tulis", "Hobi & Olahraga", "Promo & Diskon"
];

const MOCK_PRODUCTS = [
  { id: 1, name: "T-Shirt Komunitas Dev", seller: "ID Tech Community", price: 150000, originalPrice: 200000, rating: 4.8, reviews: 124, image: null, badge: "Terlaris", category: "Fashion", location: "Jakarta" },
  { id: 2, name: "Kopi Arabika Gayo", seller: "Komunitas Petani Kopi", price: 85000, originalPrice: null, rating: 4.9, reviews: 89, image: null, badge: "Promo", category: "Makanan & Minuman", location: "Aceh" },
  { id: 3, name: "Handmade Pottery Set", seller: "Komunitas Kerajinan Bandung", price: 250000, originalPrice: 300000, rating: 4.7, reviews: 56, image: null, badge: null, category: "Kerajinan & Handmade", location: "Bandung" },
  { id: 4, name: "Skincare Natural Organik", seller: "Eco Beauty Community", price: 125000, originalPrice: null, rating: 4.6, reviews: 201, image: null, badge: "Terlaris", category: "Kesehatan & Kecantikan", location: "Surabaya" },
  { id: 5, name: "Buku Pemrograman React", seller: "Tech Book Club", price: 95000, originalPrice: 120000, rating: 4.8, reviews: 67, image: null, badge: null, category: "Buku & Alat Tulis", location: "Jakarta" },
  { id: 6, name: "Merchandise Gathering", seller: "Young Entrepreneur ID", price: 75000, originalPrice: null, rating: 4.5, reviews: 43, image: null, badge: "Promo", category: "Fashion", location: "Bandung" },
  { id: 7, name: "Yoga Mat Premium", seller: "Wellness Community", price: 180000, originalPrice: 220000, rating: 4.7, reviews: 92, image: null, badge: null, category: "Hobi & Olahraga", location: "Bali" },
  { id: 8, name: "Snack Sehat Mix", seller: "Healthy Living ID", price: 45000, originalPrice: null, rating: 4.4, reviews: 156, image: null, badge: "Terlaris", category: "Makanan & Minuman", location: "Yogyakarta" },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [view, setView] = useState<"grid" | "list">("grid");

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-teal py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Marketplace Komunitas</h1>
            <p className="mt-2 text-white/80">Temukan produk unik dari komunitas di seluruh Indonesia</p>
            <div className="mt-6 flex max-w-2xl gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari produk, brand, atau kategori..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-aqua"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange/90">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar */}
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

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{MOCK_PRODUCTS.length} produk ditemukan</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setView("grid")} className={`rounded-lg p-2 ${view === "grid" ? "bg-brand-blue text-white" : "text-muted-foreground hover:bg-brand-light-gray"}`}>
                    <Grid className="h-4 w-4" />
                  </button>
                  <button onClick={() => setView("list")} className={`rounded-lg p-2 ${view === "list" ? "bg-brand-blue text-white" : "text-muted-foreground hover:bg-brand-light-gray"}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={`mt-6 grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {MOCK_PRODUCTS.map((product) => (
                  <Link
                    key={product.id}
                    href={`/marketplace/product-${product.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-brand-blue/20 hover:shadow-lg"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-brand-light-gray to-brand-blue/5">
                      <div className="absolute left-3 top-3 flex gap-2">
                        {product.badge && (
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${product.badge === "Promo" ? "bg-brand-orange" : "bg-brand-teal"}`}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <button className="absolute right-3 top-3 rounded-full bg-white p-2 text-muted-foreground shadow-sm transition-colors hover:text-red-500">
                        <Heart className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-brand-navy backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-brand-orange text-brand-orange" />
                        {product.rating}
                        <span className="text-muted-foreground">({product.reviews})</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-brand-navy group-hover:text-brand-blue">{product.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{product.seller}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {product.location}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-lg font-bold text-brand-navy">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                        )}
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