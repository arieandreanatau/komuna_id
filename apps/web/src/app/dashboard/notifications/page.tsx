"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { fetchApi } from "@/lib/api";
import type { Notification } from "@/types/api";

export default function NotificationsPage() {
  const {_user, loading: authLoading} = useAuth();
  const { data, loading, error, execute } = useApi<{ data: Notification[] }>("/member/notifications");

  const markAsRead = async (id: number) => {
    try {
      await fetchApi(`/member/notifications/${id}/read`, { method: "POST" });
      execute();
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await fetchApi("/member/notifications/read-all", { method: "POST" });
      execute();
    } catch {}
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Notifikasi</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-brand-navy hover:bg-muted"
          >
            Tandai Semua Sudah Dibaca
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border bg-white p-4 transition-colors ${
                n.read_at ? "border-border opacity-60" : "border-brand-blue/20 bg-brand-blue/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!n.read_at && <span className="h-2 w-2 rounded-full bg-brand-blue" />}
                    <p className="font-medium text-brand-navy">{n.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
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
                    className="shrink-0 rounded-lg border border-border px-3 py-1 text-xs font-medium text-brand-navy hover:bg-muted"
                  >
                    Tandai Dibaca
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <p className="mt-4 text-muted-foreground">Belum ada notifikasi.</p>
        </div>
      )}
    </div>
  );
}
