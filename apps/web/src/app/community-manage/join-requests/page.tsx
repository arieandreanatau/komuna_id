"use client";

import { useState } from "react";
import {
  UserPlus, Check, X, Clock, Search, MessageSquare, Calendar
} from "lucide-react";

const MOCK_REQUESTS = [
  { id: 1, name: "Ahmad Fauzi", email: "ahmad@email.com", reason: "Saya adalah frontend developer yang ingin belajar lebih banyak tentang komunitas tech.", date: "28 Jun 2026", status: "pending" },
  { id: 2, name: "Putri Amelia", email: "putri@email.com", reason: "Tertarik untuk bergabung dan berkontribusi di event-event komunitas.", date: "27 Jun 2026", status: "pending" },
  { id: 3, name: "Rizky Pratama", email: "rizky@email.com", reason: "Backend developer dengan 3 tahun pengalaman. Ingin sharing knowledge.", date: "25 Jun 2026", status: "approved" },
  { id: 4, name: "Nina Salsabila", email: "nina@email.com", reason: "Mahasiswa informatika yang ingin belajar dari komunitas.", date: "22 Jun 2026", status: "approved" },
  { id: 5, name: "Tommy Haryanto", email: "tommy@email.com", reason: "Ingin mengikuti workshop dan event yang diadakan.", date: "20 Jun 2026", status: "rejected" },
];

const TABS = [
  { key: "pending", label: "Menunggu", count: MOCK_REQUESTS.filter((r) => r.status === "pending").length },
  { key: "approved", label: "Disetujui", count: MOCK_REQUESTS.filter((r) => r.status === "approved").length },
  { key: "rejected", label: "Ditolak", count: MOCK_REQUESTS.filter((r) => r.status === "rejected").length },
];

export default function JoinRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");

  const filtered = MOCK_REQUESTS.filter((r) => {
    const matchTab = r.status === activeTab;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Permintaan Gabung</h1>
        <p className="text-sm text-muted-foreground">Tinjau permintaan bergabung ke komunitas</p>
      </div>

      <div className="flex gap-1 rounded-xl border border-border bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-brand-blue text-white shadow-sm"
                : "text-muted-foreground hover:bg-brand-light-gray"
            }`}
          >
            {tab.key === "pending" && <Clock className="h-4 w-4" />}
            {tab.key === "approved" && <Check className="h-4 w-4" />}
            {tab.key === "rejected" && <X className="h-4 w-4" />}
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              activeTab === tab.key ? "bg-white/20 text-white" : "bg-brand-light-gray text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((request) => (
          <div key={request.id} className="rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white shrink-0">
                  {request.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-brand-navy">{request.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      request.status === "pending"
                        ? "bg-brand-orange/10 text-brand-orange"
                        : request.status === "approved"
                          ? "bg-brand-teal/10 text-brand-teal"
                          : "bg-red-50 text-red-500"
                    }`}>
                      {request.status === "pending" ? "Menunggu" : request.status === "approved" ? "Disetujui" : "Ditolak"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.email}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {request.date}
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-brand-light-gray p-3">
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                  </div>
                </div>
              </div>
            </div>
            {request.status === "pending" && (
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 ml-16">
                <button className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-teal/90">
                  <Check className="h-4 w-4" />
                  Setujui
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                  <X className="h-4 w-4" />
                  Tolak
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-white py-12 text-center">
          <UserPlus className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-2 text-sm text-muted-foreground">Tidak ada permintaan gabung</p>
        </div>
      )}
    </div>
  );
}
