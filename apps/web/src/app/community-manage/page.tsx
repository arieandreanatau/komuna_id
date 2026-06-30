"use client";

import Link from "next/link";
import {
  Users, Calendar, BarChart3, Settings,
  Plus, TrendingUp, UserPlus, ChevronRight, Eye
} from "lucide-react";

const MOCK_COMMUNITY = {
  name: "ID Tech Community",
  slug: "id-tech-community",
  members: 1250,
  pendingRequests: 5,
  upcomingEvents: 3,
  engagementRate: 78,
};

const STATS = [
  { label: "Total Anggota", value: "1.250", icon: <Users className="h-5 w-5" />, color: "text-brand-blue" },
  { label: "Event Mendatang", value: "3", icon: <Calendar className="h-5 w-5" />, color: "text-brand-teal" },
  { label: "Partisipasi Event", value: "78%", icon: <TrendingUp className="h-5 w-5" />, color: "text-brand-aqua" },
  { label: "Permintaan Gabung", value: "5", icon: <UserPlus className="h-5 w-5" />, color: "text-brand-orange" },
];

const RECENT_ACTIVITIES = [
  { id: 1, user: "Rina Sari", action: "bergabung dengan komunitas", time: "2 jam lalu", type: "join" },
  { id: 2, user: "Dimas Prayoga", action: "mendaftar event Workshop React", time: "3 jam lalu", type: "event" },
  { id: 3, user: "Maya Putri", action: "membuat postingan baru", time: "5 jam lalu", type: "post" },
  { id: 4, user: "Budi Santoso", action: "menyelesaikan check-in", time: "1 hari lalu", type: "checkin" },
];

const UPCOMING_EVENTS = [
  { id: 1, title: "Workshop React Advanced", date: "15 Jul 2026", participants: 45, maxParticipants: 50 },
  { id: 2, title: "Tech Talk: Cloud Computing", date: "20 Jul 2026", participants: 30, maxParticipants: 40 },
  { id: 3, title: "Community Meetup", date: "25 Jul 2026", participants: 80, maxParticipants: 100 },
];

export default function CommunityManagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{MOCK_COMMUNITY.name}</h1>
          <p className="text-sm text-muted-foreground">Dashboard Pemilik Komunitas</p>
        </div>
        <Link href="/community-manage/events" className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90">
          <Plus className="h-4 w-4" />
          Buat Event
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
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-navy">Event Mendatang</h2>
              <Link href="/community-manage/events" className="text-sm font-semibold text-brand-blue hover:underline">Kelola</Link>
            </div>
            <div className="mt-4 space-y-3">
              {UPCOMING_EVENTS.map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-brand-light-gray">
                  <div>
                    <p className="font-medium text-brand-navy">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.participants}/{event.maxParticipants} peserta</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-brand-light-gray">
                      <div className="h-2 rounded-full bg-brand-blue" style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }} />
                    </div>
                    <Link href={`/community-manage/events`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-brand-light-gray">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Aktivitas Terbaru</h2>
            <div className="mt-4 space-y-3">
              {RECENT_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-brand-navy">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Aksi Cepat</h2>
            <div className="mt-4 space-y-2">
              {[
                { label: "Kelola Anggota", href: "/community-manage/members", icon: <Users className="h-4 w-4" /> },
                { label: "Permintaan Gabung", href: "/community-manage/join-requests", icon: <UserPlus className="h-4 w-4" /> },
                { label: "Buat Event", href: "/community-manage/events", icon: <Calendar className="h-4 w-4" /> },
                { label: "Analitik", href: "/community-manage/analytics", icon: <BarChart3 className="h-4 w-4" /> },
                { label: "Pengaturan", href: "/community-manage/settings", icon: <Settings className="h-4 w-4" /> },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-light-gray"
                >
                  <span className="text-brand-blue">{action.icon}</span>
                  {action.label}
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">Ringkasan</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Anggota Aktif</span>
                <span className="font-semibold text-brand-navy">890</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Event Selesai</span>
                <span className="font-semibold text-brand-navy">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Artikel Dipublikasikan</span>
                <span className="font-semibold text-brand-navy">56</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}