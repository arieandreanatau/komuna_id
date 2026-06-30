"use client";

import { useState } from "react";
import {
  ChevronLeft, Check, Copy, Ticket, Calendar
} from "lucide-react";
import Link from "next/link";

const MOCK_VOUCHERS = [
  {
    id: 1,
    code: "KOMUNA2026",
    discount: "20%",
    description: "Diskon untuk semua event",
    expiry: "31 Jul 2026",
    status: "active",
    minPurchase: "Rp 50.000",
  },
  {
    id: 2,
    code: "NEWUSER50",
    discount: "Rp 50.000",
    description: "Voucher pengguna baru",
    expiry: "15 Jul 2026",
    status: "active",
    minPurchase: "Rp 100.000",
  },
  {
    id: 3,
    code: "COMMUNITY10",
    discount: "10%",
    description: "Diskon komunitas khusus",
    expiry: "30 Jun 2026",
    status: "used",
    minPurchase: "Rp 25.000",
  },
  {
    id: 4,
    code: "FLASHSALE",
    discount: "30%",
    description: "Flash sale event spesial",
    expiry: "01 Jun 2026",
    status: "expired",
    minPurchase: "Rp 75.000",
  },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: "Aktif", className: "bg-brand-teal/10 text-brand-teal" },
  used: { label: "Terpakai", className: "bg-brand-light-gray text-muted-foreground" },
  expired: { label: "Kadaluarsa", className: "bg-red-50 text-red-500" },
};

export default function VouchersPage() {
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/wallet" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand-navy mb-4">
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Wallet
        </Link>
        <h1 className="text-2xl font-bold text-brand-navy">Voucher Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola dan gunakan voucher diskon</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MOCK_VOUCHERS.map((voucher) => {
          const status = STATUS_CONFIG[voucher.status];
          return (
            <div key={voucher.id} className="rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    voucher.status === "active" ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-light-gray text-muted-foreground"
                  }`}>
                    <Ticket className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-brand-navy">{voucher.discount}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{voucher.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 rounded-xl bg-brand-light-gray px-3 py-2">
                  <span className="flex-1 font-mono text-sm font-bold tracking-wider text-brand-navy">{voucher.code}</span>
                  <button
                    onClick={() => handleCopy(voucher.code, voucher.id)}
                    className="rounded-lg p-1 text-muted-foreground hover:bg-white"
                  >
                    {copiedId === voucher.id ? <Check className="h-4 w-4 text-brand-teal" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Berlaku hingga {voucher.expiry}
                  </span>
                  <span>Min. pembelian: {voucher.minPurchase}</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  disabled={voucher.status !== "active"}
                  onClick={() => setAppliedId(voucher.id)}
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    appliedId === voucher.id
                      ? "bg-brand-teal text-white"
                      : voucher.status === "active"
                        ? "bg-brand-blue text-white hover:bg-brand-blue/90"
                        : "bg-brand-light-gray text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {appliedId === voucher.id ? (
                    <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" /> Terpasang</span>
                  ) : voucher.status === "active" ? (
                    "Gunakan Voucher"
                  ) : voucher.status === "used" ? (
                    "Sudah Digunakan"
                  ) : (
                    "Kadaluarsa"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Punya Kode Voucher?</h2>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Masukkan kode voucher..."
            className="flex-1 rounded-xl border border-border bg-brand-light-gray px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          <button className="rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
