"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import Link from "next/link";
import { Calendar, Plus, Globe, MapPin } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { Event, PaginationMeta } from "@/types/api";
import { EventStatusBadge } from "@/components/community/EventStatusBadge";
import { CommunityEmptyState } from "@/components/community/EmptyState";
import { LoadingState } from "@/components/community/LoadingState";
import { Pagination } from "@/components/ui/pagination";

export default function CommunityEventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [events, setEvents] = useState<Event[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchApi<Event[]>(
          `/communities/${id}/events?page=${page}&per_page=12`
        );
        setEvents(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : null) || "Gagal memuat event");
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePublish = async (eventId: number) => {
    try {
      await fetchApi(`/communities/${id}/events/${eventId}/publish`, { method: "POST" });
      fetchEvents();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal menerbitkan event");
    }
  };

  const handleCancel = async (eventId: number) => {
    if (!confirm("Yakin ingin membatalkan event ini?")) return;
    try {
      await fetchApi(`/communities/${id}/events/${eventId}/cancel`, { method: "POST" });
      fetchEvents();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal membatalkan event");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Event Komunitas</h1>
          <p className="text-sm text-muted-foreground">Kelola event untuk komunitas Anda</p>
        </div>
        <Link
          href={`/dashboard/community/${id}/events/create`}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90"
        >
          <Plus className="h-4 w-4" />
          Buat Event
        </Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <CommunityEmptyState
          icon={<Calendar className="h-12 w-12" />}
          title="Belum ada event"
          description="Buat event pertama untuk komunitas Anda."
          action={
            <Link
              href={`/dashboard/community/${id}/events/create`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90"
            >
              <Plus className="h-4 w-4" />
              Buat Event
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-brand-navy line-clamp-1">{event.title}</h3>
                  <EventStatusBadge status={event.status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {event.description || "Tidak ada deskripsi"}
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(event.start_date)}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </div>
                  )}
                  {event.is_online && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      Online
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{event.current_participants} peserta</span>
                  {event.max_participants && (
                    <span>/{event.max_participants} maks</span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  {event.status === "draft" && (
                    <button
                      onClick={() => handlePublish(event.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Terbitkan
                    </button>
                  )}
                  {(event.status === "draft" || event.status === "published") && (
                    <button
                      onClick={() => handleCancel(event.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Batalkan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {meta && <Pagination meta={meta} onPageChange={fetchEvents} />}
        </>
      )}
    </div>
  );
}
