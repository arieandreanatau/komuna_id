"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { BarChart3, Users, Calendar, TrendingUp } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { LoadingState } from "@/components/community/LoadingState";

interface ReportsOverview {
  community: {
    id: number;
    name: string;
    slug: string;
  };
  member_stats: {
    total: number;
    new_this_month: number;
    growth_percentage: number;
  };
  event_stats: {
    total: number;
    active: number;
    completed: number;
    total_participants: number;
  };
  join_request_stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  recent_activity: {
    date: string;
    members_joined: number;
    events_created: number;
  }[];
}

export default function CommunityReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ReportsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<ReportsOverview>(`/communities/${id}/reports/overview`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Gagal memuat laporan"))
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Laporan Komunitas</h1>
        <p className="text-sm text-muted-foreground">Ringkasan statistik komunitas {data.community.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-blue/10 p-2">
              <Users className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Anggota</p>
              <p className="text-2xl font-semibold text-brand-navy">{data.member_stats.total}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-green-600">+{data.member_stats.growth_percentage}%</span>
            <span className="text-muted-foreground">bulan ini</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-teal/10 p-2">
              <Calendar className="h-5 w-5 text-brand-teal" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Event Aktif</p>
              <p className="text-2xl font-semibold text-brand-navy">{data.event_stats.active}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {data.event_stats.completed} event selesai
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-orange/10 p-2">
              <BarChart3 className="h-5 w-5 text-brand-orange" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Peserta Event</p>
              <p className="text-2xl font-semibold text-brand-navy">{data.event_stats.total_participants}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {data.event_stats.total} event total
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-aqua/10 p-2">
              <Users className="h-5 w-5 text-brand-aqua" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Permintaan Join</p>
              <p className="text-2xl font-semibold text-brand-navy">{data.join_request_stats.pending}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {data.join_request_stats.approved} disetujui
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Statistik Pertumbuhan Anggota</h2>
        <p className="text-sm text-muted-foreground">Pertumbuhan anggota dalam 6 bulan terakhir</p>
        {data.recent_activity && data.recent_activity.length > 0 ? (
          <div className="mt-4 space-y-2">
            {data.recent_activity.map((activity) => (
              <div key={activity.date} className="flex items-center gap-4 rounded-lg border border-border p-3">
                <span className="text-sm text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-brand-blue" style={{ width: `${Math.min(activity.members_joined * 10, 100)}%` }} />
                    <span className="text-xs text-muted-foreground">{activity.members_joined} anggota baru</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Belum ada data pertumbuhan.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Ringkasan Permintaan Join</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Menunggu", value: data.join_request_stats.pending, color: "bg-brand-orange" },
              { label: "Disetujui", value: data.join_request_stats.approved, color: "bg-green-500" },
              { label: "Ditolak", value: data.join_request_stats.rejected, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${item.color}`}
                      style={{
                        width: `${
                          data.join_request_stats.pending + data.join_request_stats.approved + data.join_request_stats.rejected > 0
                            ? (item.value /
                                (data.join_request_stats.pending +
                                  data.join_request_stats.approved +
                                  data.join_request_stats.rejected)) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-brand-navy">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Ringkasan Event</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Aktif", value: data.event_stats.active, color: "bg-brand-teal" },
              { label: "Selesai", value: data.event_stats.completed, color: "bg-brand-blue" },
              { label: "Total", value: data.event_stats.total, color: "bg-brand-navy" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${item.color}`}
                      style={{
                        width: `${
                          data.event_stats.total > 0
                            ? (item.value / data.event_stats.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-brand-navy">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
