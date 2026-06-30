"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {CheckCircle, CreditCard, Wallet, ArrowRight, ChevronRight, Truck} from "lucide-react";

const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const STEPS = ["Keranjang", "Alamat", "Pembayaran", "Konfirmasi"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/marketplace" className="hover:text-brand-blue">Marketplace</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-navy">Checkout</span>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    i + 1 <= currentStep ? "bg-brand-blue text-white" : "bg-brand-light-gray text-muted-foreground"
                  }`}>
                    {i + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`hidden text-sm sm:block ${i + 1 <= currentStep ? "font-medium text-brand-navy" : "text-muted-foreground"}`}>{step}</span>
                  {i < STEPS.length - 1 && <div className={`h-0.5 w-8 sm:w-16 ${i + 1 < currentStep ? "bg-brand-blue" : "bg-brand-light-gray"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Alamat Pengiriman</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy">Nama Lengkap</label>
                    <input type="text" defaultValue="Andi Pratama" className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-brand-navy">Telepon</label>
                      <input type="tel" defaultValue="+62 812 3456 7890" className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-navy">Kode Pos</label>
                      <input type="text" defaultValue="12345" className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy">Alamat Lengkap</label>
                    <textarea rows={3} defaultValue="Jl. Sudirman No. 123, Jakarta Selatan" className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Metode Pengiriman</h2>
                <div className="mt-4 space-y-3">
                  {[
                    { name: "Reguler", price: 15000, time: "3-5 hari" },
                    { name: "Express", price: 25000, time: "1-2 hari" },
                    { name: "Same Day", price: 35000, time: "Hari ini" },
                  ].map((method) => (
                    <label key={method.name} className="flex items-center justify-between rounded-xl border border-border p-4 cursor-pointer hover:bg-brand-light-gray">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" defaultChecked={method.name === "Regular"} className="h-4 w-4 text-brand-blue" />
                        <Truck className="h-5 w-5 text-brand-blue" />
                        <div>
                          <p className="font-medium text-brand-navy">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.time}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-brand-navy">{formatPrice(method.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Metode Pembayaran</h2>
                <div className="mt-4 space-y-3">
                  {[
                    { name: "Wallet KomunaID", icon: <Wallet className="h-5 w-5" /> },
                    { name: "Transfer Bank", icon: <CreditCard className="h-5 w-5" /> },
                    { name: "Kartu Kredit/Debit", icon: <CreditCard className="h-5 w-5" /> },
                  ].map((method) => (
                    <label key={method.name} className="flex items-center gap-3 rounded-xl border border-border p-4 cursor-pointer hover:bg-brand-light-gray">
                      <input type="radio" name="payment" defaultChecked={method.name === "Wallet KomunaID"} className="h-4 w-4 text-brand-blue" />
                      <span className="text-brand-blue">{method.icon}</span>
                      <span className="font-medium text-brand-navy">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 h-fit">
              <h2 className="text-lg font-semibold text-brand-navy">Ringkasan Pesanan</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (3 item)</span>
                  <span className="font-medium text-brand-navy">{formatPrice(385000)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span className="font-medium text-brand-navy">{formatPrice(15000)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-navy">Total</span>
                  <span className="text-xl font-bold text-brand-navy">{formatPrice(400000)}</span>
                </div>
              </div>
              <Link
                href="/marketplace/invoice"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-blue/90"
              >
                Bayar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}