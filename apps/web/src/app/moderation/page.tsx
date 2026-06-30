"use client";

import { useState } from "react";
import {
  Eye, Shield, X, Check, Clock, Filter, MessageSquare, FileText, AlertCircle, Flag
} from "lucide-react";

const MOCK_REPORTS = [
  {
    id: "RPT-001",
    contentType: "Postingan",
    contentTitle: "Spam promosi produk",
    reason: "Spam / Promosi",
    reporter: "Rina Sari",
    reportedUser: "Akun Baru",
    status: "pending",
    priority: "high",
    date: "30 Jun 2026",
  },
  {
    id: "RPT-002",
    contentType: "Komentar",
    contentTitle: "Komentar kasar dalam diskusi",
    reason: "Ucapan Kebencian",
    reporter: "Dimas Prayoga",
    reportedUser: "User123",
    status: "pending",
    priority: "high",
    date: "29 Jun 2026",
  },
  {
    id: "RPT-003",
    contentType: "Postingan",
    contentTitle: "Konten tidak pantas",
    reason: "Konten Tidak Pantas",
    reporter: "Maya Putri",
    reportedUser: "Anonim42",
    status: "in_progress",
    priority: "medium",
    date: "28 Jun 2026",
  },
  {
    id: "RPT-004",
    contentType: "Event",
    contentTitle: "Event palsu dengan link phishing",
    reason: "Penipuan",
    reporter: "Adi Wijaya",
    reportedUser: "Scammer01",
    status: "in_progress",
    priority: "high",
    date: "27 Jun 2026",
  },
  {
    id: "RPT-005",
    contentType: "Postingan",
    contentTitle: "Duplikasi konten orang lain",
    reason: "Plagiarisme",
    reporter: "Sari Dewi",
    reportedUser: "CopyPaste",
    status: "resolved",
    priority: "low",
    date: "25 Jun 2026",
  },
  {
    id: "RPT-006",
    contentType: "Komentar",
    contentTitle: "Off-topic berulang kali",
    reason: "Spam",
    reporter: "Fajar Nugroho",
    reportedUser: "Chatter99",
    status: "resolved",
    priority: "low",
    date: "22 Jun 2026",
  },
];

const TABS = [
  { key: "all", label: "Semua", icon: <Filter className="h-4 w-4" /> },
  { key: "pending", label: "Belum Ditindaklanjuti", icon: <Clock className="h-4 w-4" /> },
  { key: "in_progress", label: "Dalam Proses", icon: <AlertCircle className="h-4 w-4" /> },
  { key: "resolved", label: "Selesai", icon: <Check className="h-4 w-4" /> },
];

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  high: { label: "Tinggi", className: "bg-red-50 text-red-500" },
  medium: { label: "Sedang", className: "bg-brand-orange/10 text-brand-orange" },
  low: { label: "Rendah", className: "bg-brand-light-gray text-muted-foreground" },
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "Menunggu", className: "bg-brand-orange/10 text-brand-orange" },
  in_progress: { label: "Dalam Proses", className: "bg-brand-blue/10 text-brand-blue" },
  resolved: { label: "Selesai", className: "bg-brand-teal/10 text-brand-teal" },
};

const CONTENT_ICONS: Record<string, typeof FileText> = {
  Postingan: FileText,
  Komentar: MessageSquare,
  Event: Flag,
};

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? MOCK_REPORTS : MOCK_REPORTS.filter((r) => r.status === activeTab);

  const tabCounts = {
    all: MOCK_REPORTS.length,
    pending: MOCK_REPORTS.filter((r) => r.status === "pending").length,
    in_progress: MOCK_REPORTS.filter((r) => r.status === "in_progress").length,
    resolved: MOCK_REPORTS.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-brand-light-gray">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Moderasi</h1>
            <p className="text-sm text-muted-foreground">Kelola laporan konten komunitas</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-orange/10 px-4 py-2">
              <span className="text-sm font-semibold text-brand-orange">{tabCounts.pending} menunggu</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-muted-foreground hover:bg-brand-light-gray"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-brand-light-gray text-muted-foreground"
              }`}>
                {tabCounts[tab.key as keyof typeof tabCounts]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-brand-light-gray">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Jenis</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alasan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pelapor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prioritas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((report) => {
                  const priority = PRIORITY_CONFIG[report.priority];
                  const status = STATUS_CONFIG[report.status];
                  const ContentIcon = CONTENT_ICONS[report.contentType] || FileText;

                  return (
                    <tr key={report.id} className="transition-colors hover:bg-brand-light-gray/50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm font-semibold text-brand-blue">{report.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <ContentIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-brand-navy">{report.contentType}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{report.contentTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{report.reason}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                            {report.reporter.charAt(0)}
                          </div>
                          <span className="text-sm text-brand-navy">{report.reporter}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priority.className}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{report.date}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-brand-light-gray" title="Lihat">
                            <Eye className="h-4 w-4" />
                          </button>
                          {report.status !== "resolved" && (
                            <button className="rounded-lg p-1.5 text-brand-blue transition-colors hover:bg-brand-blue/10" title="Tindak Lanjuti">
                              <Shield className="h-4 w-4" />
                            </button>
                          )}
                          <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500" title="Abaikan">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">Tidak ada laporan ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
