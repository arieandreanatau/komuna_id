"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Star, MapPin, Heart, ShoppingCart, Share2, Shield, MessageCircle,
  Minus, Plus, ChevronRight, Truck, RotateCcw, CheckCircle
} from "lucide-react";

const MOCK_PRODUCT = {
  id: 1,
  name: "T-Shirt Komunitas Dev",
  seller: "ID Tech Community",
  price: 150000,
  originalPrice: 200000,
  rating: 4.8,
  reviews: 124,
  description: "T-Shirt premium dengan desain eksklusif dari Komunitas Developer Indonesia. Bahan katun 100% yang nyaman dan tahan lama.",
  benefits: ["Bahan Katun 100%", "Desain Eksklusif", "Tahan Lama", "Nyaman Dipakai"],
  location: "Jakarta",
  stock: 50,
  sold: 234,
  category: "Fashion",
};

const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/marketplace" className="hover:text-brand-blue">Marketplace</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-navy">{MOCK_PRODUCT.name}</span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-brand-light-gray to-brand-blue/5 flex items-center justify-center">
                <ShoppingCart className="h-24 w-24 text-brand-blue/20" />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-xl border-2 border-brand-blue bg-brand-light-gray cursor-pointer" />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">{MOCK_PRODUCT.category}</span>
                  <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">Verified</span>
                </div>
                <h1 className="mt-3 text-2xl font-bold text-brand-navy">{MOCK_PRODUCT.name}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                    <span className="font-semibold text-brand-navy">{MOCK_PRODUCT.rating}</span>
                    <span className="text-sm text-muted-foreground">({MOCK_PRODUCT.reviews} ulasan)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{MOCK_PRODUCT.sold} terjual</span>
                </div>
              </div>

              <div className="rounded-xl bg-brand-orange/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-brand-orange">{formatPrice(MOCK_PRODUCT.price)}</span>
                  {MOCK_PRODUCT.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(MOCK_PRODUCT.originalPrice)}</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">{MOCK_PRODUCT.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {MOCK_PRODUCT.benefits.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                    <CheckCircle className="h-3 w-3" />
                    {b}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{MOCK_PRODUCT.location}</span>
                <span>•</span>
                <span>Stok: {MOCK_PRODUCT.stock}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-brand-navy">Jumlah:</span>
                <div className="flex items-center rounded-lg border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-muted-foreground hover:bg-brand-light-gray">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-brand-navy">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-muted-foreground hover:bg-brand-light-gray">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-blue/90 hover:shadow-md">
                  <ShoppingCart className="h-5 w-5" />
                  Tambah ke Keranjang
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-orange/90">
                  Beli Sekarang
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border p-3 text-center">
                  <Shield className="mx-auto h-5 w-5 text-brand-teal" />
                  <p className="mt-1 text-xs font-medium text-brand-navy">Garansi Komunitas</p>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <Truck className="mx-auto h-5 w-5 text-brand-blue" />
                  <p className="mt-1 text-xs font-medium text-brand-navy">Pengamanan Aman</p>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <RotateCcw className="mx-auto h-5 w-5 text-brand-orange" />
                  <p className="mt-1 text-xs font-medium text-brand-navy">Retur 7 Hari</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-brand-light-gray hover:text-red-500">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-brand-light-gray">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue hover:underline">
                  <MessageCircle className="h-4 w-4" />
                  Chat Penjual
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}