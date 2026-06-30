"use client";

import { useState } from "react";
import {
  Wallet, ChevronLeft, Check, Building2, CreditCard, AlertTriangle, ArrowDownLeft
} from "lucide-react";
import Link from "next/link";

const BANK_ACCOUNTS = [
  { id: 1, bank: "Bank BCA", number: "1234 5678 9012", name: "Budi Santoso" },
  { id: 2, bank: "Bank Mandiri", number: "9876 5432 1098", name: "Budi Santoso" },
  { id: 3, bank: "Bank BRI", number: "5555 6666 7777", name: "Budi Santoso" },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const numericAmount = Number(amount.replace(/\D/g, ""));
  const balance = 2500000;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/wallet" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand-navy mb-4">
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Wallet
        </Link>
        <h1 className="text-2xl font-bold text-brand-navy">Tarik Dana</h1>
        <p className="text-sm text-muted-foreground">Withdraw saldo wallet ke rekening bank Anda</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-brand-navy via-brand-blue to-brand-teal p-6 text-white">
        <p className="text-sm text-white/70">Saldo Tersedia</p>
        <p className="mt-1 text-3xl font-bold">{formatPrice(balance)}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Nominal Penarikan</h2>
            <div className="mt-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-brand-navy">Rp</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-brand-light-gray py-4 pl-12 pr-4 text-2xl font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
              <div className="mt-3 flex gap-2">
                {[50000, 100000, 250000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toLocaleString("id-ID"))}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-brand-light-gray"
                  >
                    {formatPrice(preset)}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(balance.toLocaleString("id-ID"))}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-brand-blue hover:bg-brand-blue/5"
                >
                  Semua
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Rekening Tujuan</h2>
            <div className="mt-4 space-y-3">
              {BANK_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    selectedAccount === account.id
                      ? "border-brand-blue bg-brand-blue/5 shadow-sm"
                      : "border-border hover:border-brand-blue/30"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light-gray">
                    <Building2 className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-brand-navy">{account.bank}</p>
                    <p className="text-sm text-muted-foreground">{account.number}</p>
                    <p className="text-xs text-muted-foreground">{account.name}</p>
                  </div>
                  {selectedAccount === account.id && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
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
                <span className="text-muted-foreground">Nominal</span>
                <span className="font-semibold text-brand-navy">
                  {numericAmount > 0 ? formatPrice(numericAmount) : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span className="font-semibold text-brand-teal">GRATIS</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-navy">Total Diterima</span>
                  <span className="text-lg font-bold text-brand-blue">
                    {numericAmount > 0 ? formatPrice(numericAmount) : "-"}
                  </span>
                </div>
              </div>
            </div>
            <button
              disabled={!numericAmount || numericAmount <= 0 || !selectedAccount}
              className="mt-6 w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Konfirmasi Penarikan
            </button>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-brand-orange" />
            <div>
              <p className="text-sm font-medium text-brand-navy">Perhatian</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Penarikan dana akan diproses dalam 1-3 hari kerja. Pastikan data rekening benar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
