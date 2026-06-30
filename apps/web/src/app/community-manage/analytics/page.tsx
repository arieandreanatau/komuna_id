"use client";

import {
  Users, TrendingUp, Calendar, ArrowUpRight, Activity,
  MessageSquare, FileText, Eye, Heart
} from "lucide-react";

const STATS = [
  { label: "Total Anggota", value: "1.250", change: "+12%", icon: <Users className="h-5 w-5" />, color: "text-brand-blue", bg: "bg-brand-blue/10" },
  { label: "Anggota Baru Bulan Ini", value: "85", change: "+23%", icon: <TrendingUp className="h-5 w-5" />, color: "text-brand-teal", bg: "bg-brand-teal/10" },
  { label: "Tingkat Partisipasi", value: "78%", change: "+5%", icon: <Activity className="h-5 w-5" />, color: "text-brand-aqua", bg: "bg-brand-aqua/10" },
  { label: "Event Dibuat", value: "24", change: "+3", icon: <Calendar className="h-5 w-5" />, color: "text-brand-orange", bg: "bg-brand-orange/10" },
];

const MONTHLY_GROWTH = [
  { month: "Jan", value: 980 },
  { month: "Feb", value: 1020 },
  { month: "Mar", value: 1080 },
  { month: "Apr", value: 1120 },
  { month: "Mei", value: 1180 },
  { month: "Jun", value: 1250 },
];

const MAX_VALUE = Math.max(...MONTHLY_GROWTH.map((m) => m.value));

const ACTIVITY_BREAKDOWN = [
  { label: "Postingan", value: 342, icon: <FileText className="h-4 w-4" />, color: "bg-brand-blue" },
  { label: "Komentar", value: 1205, icon: <MessageSquare className="h-4 w-4" />, color: "bg-brand-teal" },
  { label: "Views", value: 8900, icon: <Eye className="h-4 w-4" />, color: "bg-brand-aqua" },
  { label: "Likes", value: 2100, icon: <Heart className="h-4 w-4" />, color: "bg-brand-orange" },
];

const TOP_MEMBERS = [
  { name: "Budi Santoso", posts: 45, comments: 120 },
  { name: "Rina Sari", posts: 38, comments: 98 },
  { name: "Dimas Prayoga", posts: 32, comments: 85 },
  { name: "Maya Putri", posts: 28, comments: 76 },
  { name: "Adi Wijaya", posts: 25, comments: 64 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Analitik Komunitas</h1>
        <p className="text-sm text-muted-foreground">Pantau pertumbuhan dan aktivitas komunitas</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <span className={`${stat.bg} ${stat.color} flex h-10 w-10 items-center justify-center rounded-xl`}>
                {stat.icon}
              </span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <span className="mb-1 inline-flex items-center gap-0.5 text-xs font-semibold text-brand-teal">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Pertumbuhan Anggota</h2>
          <p className="text-sm text-muted-foreground">6 bulan terakhir</p>
          <div className="mt-6 flex items-end gap-3 h-56">
            {MONTHLY_GROWTH.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-brand-navy">{item.value}</span>
                <div className="w-full rounded-t-lg bg-brand-blue/10 relative" style={{ height: `${(item.value / MAX_VALUE) * 100}%` }}>
                  <div className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-brand-blue to-brand-blue/70 transition-all" style={{ height: "100%" }} />
                </div>
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Breakdown Aktivitas</h2>
          <div className="mt-4 space-y-4">
            {ACTIVITY_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={item.color}>{item.icon}</span>
                    <span className="text-sm font-medium text-brand-navy">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-brand-navy">{item.value.toLocaleString("id-ID")}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-brand-light-gray">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all`}
                    style={{ width: `${(item.value / Math.max(...ACTIVITY_BREAKDOWN.map((a) => a.value))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Anggota Teraktif</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Peringkat</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Postingan</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Komentar</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TOP_MEMBERS.map((member, idx) => (
                <tr key={member.name} className="hover:bg-brand-light-gray/50">
                  <td className="py-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      idx === 0 ? "bg-brand-orange text-white" : idx === 1 ? "bg-gray-300 text-white" : idx === 2 ? "bg-brand-orange/60 text-white" : "bg-brand-light-gray text-muted-foreground"
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-brand-navy">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{member.posts}</td>
                  <td className="py-3 text-sm text-muted-foreground">{member.comments}</td>
                  <td className="py-3 text-sm font-semibold text-brand-navy">{member.posts + member.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
