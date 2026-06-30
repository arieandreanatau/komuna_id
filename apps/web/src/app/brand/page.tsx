"use client";

import Link from "next/link";
import {
  Users, Handshake, TrendingUp, Settings, Package, Plus
} from "lucide-react";

const MOCK_BRAND = {
  name: "GreenTech Indonesia",
  description: "Brand teknologi ramah lingkungan yang berkomitmen untuk keberlanjutan.",
  website: "https://greentech.id",
  email: "hello@greentech.id",
  location: "Jakarta Pusat",
  industry: "Teknologi Hijau",
  status: "active" as const,
};

const STATS = [
  { label: "Kolaborasi Aktif", value: "8", icon: <Handshake className="h-5 w-5" />, color: "text-brand-blue" },
  { label: "Komunitas Terhubung", value: "12", icon: <Users className="h-5 w-5" />, color: "text-brand-teal" },
  { label: "Proyek Berjalan", value: "5", icon: <Package className="h-5 w-5" />, color: "text-brand-aqua" },
  { label: "Dampak Tercapai", value: "1.2K", icon: <TrendingUp className="h-5 w-5" />, color: "text-brand-orange" },
];

const PIPELINE = [
  { id: 1, title: "Sponsorship Event Tech", community: "ID Tech Community", status: "inquiry", date: "30 Jun 2026", budget: "Rp 15.000.000" },
  { id: 2, title: "Product Launch Collaboration", community: "Komunitas Desain", status: "review", date: "28 Jun 2026", budget: "Rp 25.000.000" },
  { id: 3, title: "Brand Activation", community: "Young Entrepreneur", status: "negotiation", date: "25 Jun 2026", budget: "Rp 10.000.000" },
  { id: 4, title: "Workshop Sustainability", community: "Eco Warriors", status: "running", date: "20 Jun 2026", budget: "Rp 8.000.000" },
];

const TEAM = [
  { id: 1, name: "Rina Sari", email: "rina@greentech.id", role: "Partnership Manager", status: "active" },
  { id: 2, name: "Dimas Prayoga", email: "dimas@greentech.id", role: "Program Lead", status: "active" },
  { id: 3, name: "Maya Putri", email: "maya@greentech.id", role: "Communications", status: "active" },
];

const PROJECTS = [
  { id: 1, title: "Green Community Challenge", status: "active", progress: 75, deadline: "31 Jul 2026" },
  { id: 2, title: "Eco Workshop Series", status: "active", progress: 40, deadline: "15 Ags 2026" },
  { id: 3, title: "Sustainability Report 2026", status: "planning", progress: 10, deadline: "30 Sep 2026" },
];

export default function BrandDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{MOCK_BRAND.name}</h1>
          <p className="text-sm text-muted-foreground">Dashboard Brand</p>
        </div>
        <div className="flex gap-3">
          <Link href="/brand/collaborations" className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal/90">
            <Handshake className="h-4 w-4" />
            Ajukan Kolaborasi
          </Link>
          <Link href="/brand/profile" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-light-gray">
            <Settings className="h-4 w-4" />
            Pengaturan
          </Link>
        </div>
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
          <h2 className="text-lg font-semibold text-brand-navy">Pipeline Kolaborasi</h2>
          <div className="mt-4 space-y-3">
            {PIPELINE.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-brand-light-gray">
                <div>
                  <p className="font-medium text-brand-navy">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.community} • {item.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-brand-navy">{item.budget}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "running" ? "bg-brand-teal/10 text-brand-teal" :
                    item.status === "review" ? "bg-brand-blue/10 text-brand-blue" :
                    item.status === "negotiation" ? "bg-brand-aqua/10 text-brand-aqua" :
                    "bg-brand-orange/10 text-brand-orange"
                  }`}>
                    {item.status === "running" ? "Berjalan" :
                     item.status === "review" ? "Review" :
                     item.status === "negotiation" ? "Negosiasi" : "Inquiry"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Proyek Aktif</h2>
            <div className="mt-4 space-y-4">
              {PROJECTS.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-brand-navy">{project.title}</p>
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-brand-light-gray">
                    <div className="h-2 rounded-full bg-brand-blue transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Deadline: {project.deadline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-navy">Tim Brand</h2>
              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-brand-light-gray">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {TEAM.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-navy">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}