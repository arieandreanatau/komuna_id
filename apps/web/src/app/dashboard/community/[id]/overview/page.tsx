"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { Users, UserPlus, Calendar, TicketCheck } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { CommunityDashboard } from "@/types/api";
import { LoadingState } from "@/components/community/LoadingState";

const STAT_ICONS = [
  { key: "total_members", label: "Total Anggota", color: "text-brand-blue", icon: Users },
  { key: "pending_join_requests", label: "Permintaan Join", color: "text-brand-orange", icon: UserPlus },
  { key: "active_events", label: "Event Aktif", color: "text-brand-teal", icon: Calendar },
  { key: "event_participants", label: "Peserta Event", color: "text-brand-aqua", icon: TicketCheck },
] as const;

export default function CommunityOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<CommunityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<CommunityDashboard>(`/communities/${id}/dashboard`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Gagal memuat dashboard"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  if (!data) return null;

  const stats = [
    { label: "Total Anggota", value: data.stats.total_members, icon: Users, color: "text-brand-blue" },
    { label: "Permintaan Join", value: data.stats.pending_join_requests, icon: UserPlus, color: "text-brand-orange" },
    { label: "Event Aktif", value: data.stats.active_events, icon: Calendar, color: "text-brand-teal" },
    { label: "Peserta Event", value: data.stats.event_participants, icon: TicketCheck, color: "text-brand-aqua" },
  ];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Dashboard Komunitas</h1>
        <p className="text-sm text-muted-foreground">{data.community.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Anggota Terbaru</h2>
          {data.recent_members && data.recent_members.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.recent_members.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-brand-navy">{member.user?.name || "Pengguna"}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(member.joined_at)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada anggota.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Event Mendatang</h2>
          {data.upcoming_events && data.upcoming_events.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.upcoming_events.slice(0, 5).map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/community/${id}/events`}
                  className="block rounded-lg border border-border p-3 hover:bg-muted/50"
                >
                  <p className="font-medium text-brand-navy">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(event.start_date)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada event mendatang.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Permintaan Join Terbaru</h2>
          {data.recent_join_requests && data.recent_join_requests.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.recent_join_requests.slice(0, 5).map((req) => (
                <div key={req.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-brand-navy">{req.user?.name || "Pengguna"}</p>
                    <p className="text-xs text-muted-foreground">{req.message || "Permintaan bergabung"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(req.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Tidak ada permintaan join.</p>
          )}
        </div>
      </div>
    </div>
  );
}
