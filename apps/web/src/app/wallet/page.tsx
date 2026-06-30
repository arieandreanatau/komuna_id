"use client";

import Link from "next/link";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Receipt, TrendingUp,
  Plus, Download, Eye, Filter, ChevronDown, Calendar, DollarSign, BarChart3
} from "lucide-react";

const MOCK_WALLET = {
  balance: 2500000,
  totalTransactions: 45,
  totalSpent: 1250000,
  totalTopUp: 3750000,
};

const MOCK_TRANSACTIONS = [
  { id: 1, type: "topup", description: "Top Up via Bank BCA", amount: 500000, date: "30 Jun 2026", status: "completed" },
  { id: 2, type: "payment", description: "Pembayaran Event Workshop", amount: -75000, date: "28 Jun 2026", status: "completed" },
  { id: 3, type: "payment", description: "Pembelian T-Shirt Komunitas", amount: -150000, date: "25 Jun 2026", status: "completed" },
  { id: 4, type: "topup", description: "Top Up via GoPay", amount: 200000, date: "22 Jun 2026", status: "completed" },
  { id: 5, type: "refund", description: "Refund Event Dibatalkan", amount: 50000, date: "20 Jun 2026", status: "completed" },
  { id: 6, type: "payment", description: "Booking Venue Meeting", amount: -350000, date: "18 Jun 2026", status: "completed" },
];

const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Math.abs(price));

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Wallet KomunaID</h1>
          <p className="text-sm text-muted-foreground">Kelola saldo dan transaksi Anda</p>
        </div>
        <div className="flex gap-3">
          <Link href="/wallet/topup" className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90">
            <Plus className="h-4 w-4" />
            Top Up
          </Link>
          <Link href="/wallet/withdraw" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-light-gray">
            <ArrowDownLeft className="h-4 w-4" />
            Tarik Dana
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-brand-navy via-brand-blue to-brand-teal p-8 text-white">
        <p className="text-sm text-white/70">Saldo Tersedia</p>
        <p className="mt-2 text-4xl font-bold">{formatPrice(MOCK_WALLET.balance)}</p>
        <div className="mt-6 flex gap-6">
          <div>
            <p className="text-xs text-white/60">Total Transaksi</p>
            <p className="text-lg font-semibold">{MOCK_WALLET.totalTransactions}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Total Pengeluaran</p>
            <p className="text-lg font-semibold">{formatPrice(MOCK_WALLET.totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Total Top Up</p>
            <p className="text-lg font-semibold">{formatPrice(MOCK_WALLET.totalTopUp)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Transaksi", value: "45", icon: <Receipt className="h-5 w-5" />, color: "text-brand-blue" },
          { label: "Total Pengeluaran", value: formatPrice(MOCK_WALLET.totalSpent), icon: <TrendingUp className="h-5 w-5" />, color: "text-brand-orange" },
          { label: "Total Pemasukan", value: formatPrice(MOCK_WALLET.totalTopUp), icon: <DollarSign className="h-5 w-5" />, color: "text-brand-teal" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <p className={`mt-2 text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Riwayat Transaksi</h2>
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-brand-light-gray">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tx.type === "topup" || tx.type === "refund" ? "bg-brand-teal/10 text-brand-teal" : "bg-brand-orange/10 text-brand-orange"}`}>
                  {tx.type === "topup" || tx.type === "refund" ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium text-brand-navy">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <span className={`text-lg font-bold ${tx.amount > 0 ? "text-brand-teal" : "text-brand-orange"}`}>
                {tx.amount > 0 ? "+" : "-"}{formatPrice(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}