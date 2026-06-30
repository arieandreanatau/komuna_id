"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { Bell, Check, Megaphone } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { Notification, PaginationMeta } from "@/types/api";
import { CommunityEmptyState } from "@/components/community/EmptyState";
import { LoadingState } from "@/components/community/LoadingState";
import { Pagination } from "@/components/ui/pagination";

interface Announcement {
  id: number;
  title: string;
  message: string;
  created_at: string;
}

export default function CommunityNotificationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchApi<Notification[]>(
          `/communities/${id}/notifications?page=${page}&per_page=15`
        );
        setNotifications(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : null) || "Gagal memuat notifikasi");
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchNotifications();
    fetchApi<Announcement[]>(`/communities/${id}/announcements?per_page=5`)
      .then((res) => setAnnouncements(res.data))
      .catch(() => {});
  }, [id, fetchNotifications]);

  const markAsRead = async (notificationId: number) => {
    try {
      await fetchApi(`/communities/${id}/notifications/${notificationId}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await fetchApi(`/communities/${id}/notifications/read-all`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Notifikasi Komunitas</h1>
          <p className="text-sm text-muted-foreground">Pantau notifikasi dari komunitas</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          <Check className="h-4 w-4" />
          Tandai Semua Dibaca
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-white">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-brand-navy">Notifikasi</h2>
            </div>
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6">
                <CommunityEmptyState
                  icon={<Bell className="h-8 w-8" />}
                  title="Tidak ada notifikasi"
                  description="Notifikasi terbaru akan muncul di sini."
                />
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-6 py-4 transition-colors hover:bg-muted/30 ${
                        n.read_at ? "opacity-60" : ""
                      }`}
                    >
                      <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        n.read_at ? "bg-transparent" : "bg-brand-blue"
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-brand-navy">{n.title}</p>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(n.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!n.read_at && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                          title="Tandai sudah dibaca"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {meta && (
                  <div className="border-t border-border px-6 py-4">
                    <Pagination meta={meta} onPageChange={fetchNotifications} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="flex items-center gap-2 font-semibold text-brand-navy">
              <Megaphone className="h-5 w-5 text-brand-orange" />
              Pengumuman
            </h2>
            {announcements.length > 0 ? (
              <div className="mt-4 space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-lg border border-border p-3">
                    <p className="font-medium text-brand-navy">{a.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Belum ada pengumuman.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
