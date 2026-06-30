"use client";

import { useAuth } from "@/hooks/useAuth";
import { fetchApi } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Community, Event, Notification } from "@/types/api";

interface DashboardData {
  communities_count: number;
  events_count: number;
  tickets_count: number;
  notifications_unread: number;
  pending_role_requests: number;
  recent_communities: Community[];
  upcoming_events: Event[];
  recent_notifications: Notification[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchApi<DashboardData>("/member/dashboard")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const hasEmail = !!user?.email;
  const hasAvatar = !!user?.profile?.avatar;
  const hasPhoneNumber = !!user?.phone_number || !!user?.profile?.phone;

  const completionItems = [
    { label: "Tambahkan email", done: hasEmail, href: "/dashboard/profile" },
    { label: "Verifikasi email", done: !!user?.email_verified_at, href: "/dashboard/profile" },
    { label: "Tambahkan nomor WhatsApp", done: hasPhoneNumber, href: "/dashboard/profile" },
    { label: "Tambahkan foto profil", done: hasAvatar, href: "/dashboard/profile" },
  ];

  const incompleteCount = completionItems.filter((item) => !item.done).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">
          Selamat datang di Komuna, {user?.full_name || user?.username}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Akunmu sudah aktif. Kamu bisa langsung mulai eksplor komunitas, event, dan fitur Komuna lainnya.
        </p>
      </div>

      {incompleteCount > 0 && (
        <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-4">
          <h3 className="text-sm font-semibold text-brand-navy">Lengkapi Akunmu</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Verifikasi email bersifat opsional, tetapi disarankan untuk keamanan akun dan pemulihan password.
          </p>
          <div className="mt-3 space-y-1.5">
            {completionItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 text-sm ${
                  item.done ? "text-green-600" : "text-muted-foreground hover:text-brand-blue"
                }`}
              >
                <span className={item.done ? "text-green-500" : "text-gray-400"}>
                  {item.done ? "✓" : "○"}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Komunitas", value: data?.communities_count || 0, color: "text-brand-blue", href: "/dashboard/my-communities" },
          { label: "Event Diikuti", value: data?.events_count || 0, color: "text-brand-teal", href: "/dashboard/my-events" },
          { label: "Tiket Aktif", value: data?.tickets_count || 0, color: "text-brand-aqua", href: "/dashboard/my-tickets" },
          { label: "Notifikasi", value: data?.notifications_unread || 0, color: "text-brand-orange", href: "/dashboard/notifications" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-border bg-white p-6 transition-colors hover:bg-muted/50"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Aksi Cepat</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Eksplor Komunitas", href: "/communities", icon: "search", color: "bg-brand-blue" },
            { label: "Cari Event", href: "/events", icon: "calendar", color: "bg-brand-teal" },
            { label: "Buat Komunitas", href: "/communities/create", icon: "plus", color: "bg-brand-aqua" },
            { label: "Daftarkan Organization", href: "/organization/create", icon: "building", color: "bg-brand-orange" },
            { label: "Lengkapi Profil", href: "/dashboard/profile", icon: "user", color: "bg-brand-navy" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:bg-muted/50"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-full ${action.color} text-white text-sm`}>
                {action.icon === "search" && "🔍"}
                {action.icon === "calendar" && "📅"}
                {action.icon === "plus" && "+"}
                {action.icon === "building" && "🏢"}
                {action.icon === "user" && "👤"}
              </span>
              <span className="text-sm font-medium text-brand-navy">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {data?.pending_role_requests ? data.pending_role_requests > 0 : false ? (
        <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-4">
          <p className="text-sm text-brand-orange">
            Anda memiliki {data?.pending_role_requests} permintaan role yang perlu diperhatikan.
          </p>
          <Link href="/dashboard/role-requests" className="mt-2 inline-block text-sm font-medium text-brand-blue hover:underline">
            Lihat Permintaan Role
          </Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-navy">Komunitas Terbaru</h2>
            <Link href="/dashboard/my-communities" className="text-sm text-brand-blue hover:underline">
              Lihat Semua
            </Link>
          </div>
          {data?.recent_communities && data.recent_communities.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.recent_communities.map((c) => (
                <Link key={c.id} href={`/communities/${c.slug}`} className="block rounded-lg border border-border p-3 hover:bg-muted/50">
                  <p className="font-medium text-brand-navy">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.category?.name || "Umum"}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Anda belum bergabung dengan komunitas manapun.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-navy">Event Mendatang</h2>
            <Link href="/dashboard/my-events" className="text-sm text-brand-blue hover:underline">
              Lihat Semua
            </Link>
          </div>
          {data?.upcoming_events && data.upcoming_events.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.upcoming_events.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`} className="block rounded-lg border border-border p-3 hover:bg-muted/50">
                  <p className="font-medium text-brand-navy">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(e.start_date)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada event mendatang.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Notifikasi Terbaru</h2>
          <Link href="/dashboard/notifications" className="text-sm text-brand-blue hover:underline">
            Lihat Semua
          </Link>
        </div>
        {data?.recent_notifications && data.recent_notifications.length > 0 ? (
          <div className="mt-4 space-y-3">
            {data.recent_notifications.map((n) => (
              <div key={n.id} className={`rounded-lg border border-border p-3 ${n.read_at ? "opacity-60" : ""}`}>
                <p className="font-medium text-brand-navy">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Belum ada notifikasi.</p>
        )}
      </div>
    </div>
  );
}
