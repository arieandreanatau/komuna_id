"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Headphones, Plus, Search, Filter, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronRight } from "lucide-react";

const MOCK_TICKETS = [
  { id: "TKT-001", subject: "Masalah Pembayaran Event", category: "Pembayaran", status: "open", priority: "high", date: "30 Jun 2026", lastReply: "2 jam lalu" },
  { id: "TKT-002", subject: "Tidak Bisa Join Komunitas", category: "Komunitas", status: "waiting_reply", priority: "medium", date: "28 Jun 2026", lastReply: "1 hari lalu" },
  { id: "TKT-003", subject: "Bug pada Halaman Profil", category: "Bug Report", status: "resolved", priority: "low", date: "25 Jun 2026", lastReply: "3 hari lalu" },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: "Terbuka", color: "bg-brand-orange/10 text-brand-orange", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  waiting_reply: { label: "Menunggu Balasan", color: "bg-brand-blue/10 text-brand-blue", icon: <Clock className="h-3.5 w-3.5" /> },
  resolved: { label: "Selesai", color: "bg-brand-teal/10 text-brand-teal", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  closed: { label: "Ditutup", color: "bg-gray-100 text-gray-500", icon: <CheckCircle className="h-3.5 w-3.5" /> },
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">Pusat Bantuan</h1>
              <p className="text-sm text-muted-foreground">Kelola tiket support Anda</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90">
              <Plus className="h-4 w-4" />
              Buat Tiket Baru
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Terbuka", value: "1", color: "text-brand-orange", bg: "bg-brand-orange/10" },
              { label: "Menunggu Balasan", value: "1", color: "text-brand-blue", bg: "bg-brand-blue/10" },
              { label: "Selesai", value: "1", color: "text-brand-teal", bg: "bg-brand-teal/10" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-white">
            <div className="flex items-center gap-1 border-b border-border p-1">
              {["all", "open", "waiting", "resolved"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab ? "bg-brand-blue text-white" : "text-muted-foreground hover:bg-brand-light-gray"
                  }`}
                >
                  {tab === "all" ? "Semua" : tab === "open" ? "Terbuka" : tab === "waiting" ? "Menunggu" : "Selesai"}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-3">
              {MOCK_TICKETS.map((ticket) => {
                const status = STATUS_MAP[ticket.status];
                return (
                  <Link
                    key={ticket.id}
                    href={`/support/${ticket.id}`}
                    className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-brand-light-gray"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                        <Headphones className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-0.5 font-medium text-brand-navy">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.category} • {ticket.date} • {ticket.lastReply}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}