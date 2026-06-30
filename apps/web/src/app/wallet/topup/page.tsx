"use client";

import { useState } from "react";
import {
  ChevronLeft, Smartphone, Building2
} from "lucide-react";
import Link from "next/link";

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000];

const PAYMENT_METHODS = [
  { id: "bca", name: "Bank BCA", icon: <Building2 className="h-5 w-5" /> },
  { id: "bri", name: "Bank BRI", icon: <Building2 className="h-5 w-5" /> },
  { id: "mandiri", name: "Bank Mandiri", icon: <Building2 className="h-5 w-5" /> },
  { id: "gopay", name: "GoPay", icon: <Smartphone className="h-5 w-5" /> },
  { id: "ovo", name: "OVO", icon: <Smartphone className="h-5 w-5" /> },
  { id: "dana", name: "DANA", icon: <Smartphone className="h-5 w-5" /> },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function TopUpPage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  const finalAmount = isCustom ? Number(customAmount.replace(/\D/g, "")) : amount;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/wallet" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand-navy mb-4">
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Wallet
        </Link>
        <h1 className="text-2xl font-bold text-brand-navy">Top Up Saldo</h1>
        <p className="text-sm text-muted-foreground">Tambahkan saldo ke wallet KomunaID Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Pilih Nominal</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => { setAmount(preset); setIsCustom(false); }}
                  className={`rounded-xl border-2 p-4 text-center transition-all ${
                    amount === preset && !isCustom
                      ? "border-brand-blue bg-brand-blue/5 shadow-sm"
                      : "border-border hover:border-brand-blue/30"
                  }`}
                >
                  <p className={`text-lg font-bold ${amount === preset && !isCustom ? "text-brand-blue" : "text-brand-navy"}`}>
                    {formatPrice(preset)}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={() => setIsCustom(true)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  isCustom
                    ? "border-brand-blue bg-brand-blue/5 shadow-sm"
                    : "border-border hover:border-brand-blue/30"
                }`}
              >
                <p className="text-sm font-medium text-muted-foreground">Nominal Lainnya</p>
                {isCustom ? (
                  <div className="mt-2 relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-navy">Rp</span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
                      placeholder="Masukkan nominal"
                      autoFocus
                      className="w-full border-0 bg-transparent py-1 pl-8 pr-0 text-lg font-bold text-brand-navy focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="mt-1 text-lg font-bold text-brand-navy">Masukkan nominal custom</p>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Metode Pembayaran</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    selectedMethod === method.id
                      ? "border-brand-blue bg-brand-blue/5 shadow-sm"
                      : "border-border hover:border-brand-blue/30"
                  }`}
                >
                  <span className={selectedMethod === method.id ? "text-brand-blue" : "text-muted-foreground"}>
                    {method.icon}
                  </span>
                  <span className={`text-sm font-medium ${selectedMethod === method.id ? "text-brand-blue" : "text-brand-navy"}`}>
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Ringkasan</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nominal Top Up</span>
                <span className="font-semibold text-brand-navy">
                  {finalAmount && finalAmount > 0 ? formatPrice(finalAmount) : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span className="font-semibold text-brand-teal">GRATIS</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-navy">Total Bayar</span>
                  <span className="text-lg font-bold text-brand-blue">
                    {finalAmount && finalAmount > 0 ? formatPrice(finalAmount) : "-"}
                  </span>
                </div>
              </div>
            </div>
            <button
              disabled={!finalAmount || finalAmount <= 0 || !selectedMethod}
              className="mt-6 w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Konfirmasi Top Up
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-brand-light-gray p-4">
            <p className="text-xs text-muted-foreground">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan top up KomunaID. Proses verifikasi akan dilakukan secara otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
