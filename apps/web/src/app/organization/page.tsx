"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building, Users, FileText, Calendar, Handshake, BarChart3, Settings,
  Plus, ChevronRight, TrendingUp, Globe, Mail, Phone, MapPin, ExternalLink,
  Upload, Download, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle
} from "lucide-react";

const MOCK_ORG = {
  name: "Yayasan Tech For Indonesia",
  description: "Organisasi yang bergerak di bidang pemberdayaan teknologi untuk Indonesia yang lebih baik.",
  website: "https://techforindonesia.org",
  email: "info@techforindonesia.org",
  phone: "+62 21 5555 0123",
  location: "Jakarta Selatan",
  status: "active" as const,
  logo: null,
  members_count: 24,
  communities_count: 5,
  activities_count: 12,
  impact_score: 850,
};

const STATS = [
  { label: "Total Komunitas", value: "5", icon: <Users className="h-5 w-5" />, color: "text-brand-blue" },
  { label: "Total Anggota", value: "24", icon: <Building className="h-5 w-5" />, color: "text-brand-teal" },
  { label: "Kegiatan Aktif", value: "12", icon: <Calendar className="h-5 w-5" />, color: "text-brand-aqua" },
  { label: "Dampak Tercapai", value: "850", icon: <TrendingUp className="h-5 w-5" />, color: "text-brand-orange" },
];

const RECENT_ACTIVITIES = [
  { id: 1, title: "Workshop AI untuk Pemuda", date: "28 Jun 2026", status: "completed", type: "Kegiatan" },
  { id: 2, title: "Kolaborasi dengan Komunitas Dev", date: "25 Jun 2026", status: "active", type: "Kolaborasi" },
  { id: 3, title: "Program Literasi Digital", date: "20 Jun 2026", status: "active", type: "Program" },
  { id: 4, title: "Donasi Perangkat Keras", date: "15 Jun 2026", status: "completed", type: "Kegiatan" },
];

const COLLABORATIONS = [
  { id: 1, title: "AI Workshop Series", partner: "ID Tech Community", status: "running", date: "Jul 2026" },
  { id: 2, title: "Digital Literacy Program", partner: "Komunitas EduTech", status: "completed", date: "Jun 2026" },
  { id: 3, title: "Hackathon for Good", partner: "Dev Community Bandung", status: "inquiry", date: "Agu 2026" },
];

const DOCUMENTS = [
  { id: 1, name: "Laporan Tahunan 2025.pdf", type: "PDF", uploadedBy: "Admin", date: "15 Jan 2026", size: "2.4 MB" },
  { id: 2, name: "Anggaran Dasar.pdf", type: "PDF", uploadedBy: "Admin", date: "01 Jan 2026", size: "1.1 MB" },
  { id: 3, name: "Struktur Organisasi.png", type: "Image", uploadedBy: "Sekretaris", date: "10 Mar 2026", size: "856 KB" },
];

export default function OrganizationDashboard() {
  const [_activeTab, _setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{MOCK_ORG.name}</h1>
          <p className="text-sm text-muted-foreground">Dashboard Organisasi</p>
        </div>
        <Link href="/organization/profile" className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90">
          <Settings className="h-4 w-4" />
          Pengaturan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Kegiatan Terbaru</h2>
          <div className="mt-4 space-y-3">
            {RECENT_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-brand-light-gray">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activity.status === "completed" ? "bg-brand-teal/10 text-brand-teal" : "bg-brand-blue/10 text-brand-blue"}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-navy">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.type} • {activity.date}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activity.status === "completed" ? "bg-brand-teal/10 text-brand-teal" : "bg-brand-blue/10 text-brand-blue"}`}>
                  {activity.status === "completed" ? "Selesai" : "Aktif"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Info Organisasi</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 text-brand-blue" />
                <span>{MOCK_ORG.website}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-brand-blue" />
                <span>{MOCK_ORG.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-brand-blue" />
                <span>{MOCK_ORG.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-brand-blue" />
                <span>{MOCK_ORG.location}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Dokumen Terbaru</h2>
            <div className="mt-4 space-y-3">
              {DOCUMENTS.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-brand-blue" />
                    <div>
                      <p className="text-sm font-medium text-brand-navy">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-brand-light-gray">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Kolaborasi Aktif</h2>
          <Link href="/brand/collaborations" className="text-sm font-semibold text-brand-blue hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLABORATIONS.map((collab) => (
            <div key={collab.id} className="rounded-xl border border-border p-5 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-navy">{collab.title}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  collab.status === "running" ? "bg-brand-teal/10 text-brand-teal" :
                  collab.status === "completed" ? "bg-brand-blue/10 text-brand-blue" :
                  "bg-brand-orange/10 text-brand-orange"
                }`}>
                  {collab.status === "running" ? "Berjalan" : collab.status === "completed" ? "Selesai" : "Inquiry"}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{collab.partner}</p>
              <p className="mt-1 text-xs text-muted-foreground">{collab.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}