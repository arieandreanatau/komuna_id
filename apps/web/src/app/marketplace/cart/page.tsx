"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Shield, Truck, CreditCard
} from "lucide-react";

const MOCK_CART = [
  { id: 1, name: "T-Shirt Komunitas Dev", seller: "ID Tech Community", price: 150000, quantity: 2, image: null },
  { id: 2, name: "Kopi Arabika Gayo", seller: "Komunitas Petani Kopi", price: 85000, quantity: 1, image: null },
];

const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function CartPage() {
  const [items] = useState(MOCK_CART);
  const [promoCode, setPromoCode] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15000;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-brand-navy">Keranjang Belanja</h1>
          <p className="text-sm text-muted-foreground">{items.length} produk di keranjang</p>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-brand-light-gray flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-brand-blue/30" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-brand-navy">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.seller}</p>
                      <p className="mt-2 text-lg font-bold text-brand-navy">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border">
                        <button className="px-2 py-1 text-muted-foreground hover:bg-brand-light-gray"><Minus className="h-4 w-4" /></button>
                        <span className="px-3 py-1 text-sm font-semibold text-brand-navy">{item.quantity}</span>
                        <button className="px-2 py-1 text-muted-foreground hover:bg-brand-light-gray"><Plus className="h-4 w-4" /></button>
                      </div>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 h-fit">
              <h2 className="text-lg font-semibold text-brand-navy">Ringkasan Pesanan</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-brand-navy">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span className="font-medium text-brand-navy">{formatPrice(shipping)}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kode promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                  <button className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange/90">
                    <Tag className="h-4 w-4" />
                  </button>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-navy">Total</span>
                  <span className="text-xl font-bold text-brand-navy">{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                href="/marketplace/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-blue/90"
              >
                Lanjut ke Pembayaran
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-brand-light-gray p-2 text-center">
                  <Shield className="mx-auto h-4 w-4 text-brand-teal" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Aman</p>
                </div>
                <div className="rounded-lg bg-brand-light-gray p-2 text-center">
                  <Truck className="mx-auto h-4 w-4 text-brand-blue" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Kirim Cepat</p>
                </div>
                <div className="rounded-lg bg-brand-light-gray p-2 text-center">
                  <CreditCard className="mx-auto h-4 w-4 text-brand-orange" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Bayar Aman</p>
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