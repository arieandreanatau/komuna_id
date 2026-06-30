"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, Download, ArrowLeft, Printer, MessageCircle } from "lucide-react";

const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function InvoicePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/10">
              <CheckCircle className="h-8 w-8 text-brand-teal" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-brand-navy">Pembayaran Berhasil!</h1>
            <p className="mt-2 text-muted-foreground">Pesanan Anda telah berhasil diproses.</p>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Invoice ID</p>
                <p className="font-semibold text-brand-navy">INV-2026-001234</p>
              </div>
              <span className="rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm font-semibold text-brand-teal">Lunas</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Tanggal</p>
                <p className="text-sm font-medium text-brand-navy">30 Juni 2026</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Metode Pembayaran</p>
                <p className="text-sm font-medium text-brand-navy">Wallet KomunaID</p>
              </div>
            </div>

            <hr className="my-6 border-border" />

            <h3 className="font-semibold text-brand-navy">Rincian Pesanan</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">T-Shirt Komunitas Dev (x2)</span>
                <span className="font-medium text-brand-navy">{formatPrice(300000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kopi Arabika Gayo (x1)</span>
                <span className="font-medium text-brand-navy">{formatPrice(85000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pengiriman Reguler</span>
                <span className="font-medium text-brand-navy">{formatPrice(15000)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="font-semibold text-brand-navy">Total</span>
                <span className="text-xl font-bold text-brand-navy">{formatPrice(400000)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-light-gray">
                <Download className="h-4 w-4" />
                Download PDF
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-light-gray">
                <Printer className="h-4 w-4" />
                Cetak
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Marketplace
            </Link>
            <Link href="/support" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">
              <MessageCircle className="h-4 w-4" />
              Hubungi Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}