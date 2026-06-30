"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EventRegistration } from "@/types/api";

export default function MyEventsPage() {
  const {_user, loading: authLoading} = useAuth();
  const router = useRouter();
  const { data, loading, error } = useApi<{ data: EventRegistration[] }>("/me/events");

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const statusColors: Record<string, string> = {
    registered: "bg-brand-teal/10 text-brand-teal",
    checked_in: "bg-brand-blue/10 text-brand-blue",
    cancelled: "bg-red-50 text-red-600",
  };

  const statusLabels: Record<string, string> = {
    registered: "Terdaftar",
    checked_in: "Check-in",
    cancelled: "Dibatalkan",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Event Saya</h1>
          <p className="text-sm text-muted-foreground">Event yang Anda ikuti</p>
        </div>
        <button
          onClick={() => router.push("/events")}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90"
        >
          Jelajahi Event
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {data?.data && data.data.length > 0 ? (
        <div className="space-y-3">
          {data.data.map((reg) => (
            <div key={reg.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Link href={`/events/${reg.event.slug}`} className="font-medium text-brand-navy hover:underline">
                    {reg.event.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(reg.event.start_date)}
                  </p>
                  {reg.event.community && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      oleh {reg.event.community.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[reg.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[reg.status] || reg.status}
                  </span>
                  {reg.status === "registered" && (
                    <Link
                      href={`/dashboard/my-tickets`}
                      className="rounded-lg bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue hover:bg-brand-blue/20"
                    >
                      Lihat Tiket
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <p className="mt-4 text-muted-foreground">Belum ada event yang Anda ikuti.</p>
          <Link href="/events" className="mt-4 inline-flex rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90">
            Jelajahi Event
          </Link>
        </div>
      )}
    </div>
  );
}
