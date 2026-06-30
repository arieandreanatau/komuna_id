"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import type {
  EventRegistration
} from "@/types/api";

export default function MyTicketsPage() {
  const { loading: authLoading } = useAuth();
  const { data, loading, error } = useApi<{ data: EventRegistration[] }>("/me/tickets");

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Tiket Saya</h1>
        <p className="text-sm text-muted-foreground">Tiket event yang Anda miliki</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((ticket) => (
            <div key={ticket.id} className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="border-b border-dashed border-border p-4">
                <p className="font-medium text-brand-navy">{ticket.event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(ticket.event.start_date)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(ticket.event.start_date)}
                </p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className={`text-sm font-medium ${ticket.status === "registered" ? "text-brand-teal" : ticket.status === "checked_in" ? "text-brand-blue" : "text-red-600"}`}>
                      {ticket.status === "registered" ? "Aktif" : ticket.status === "checked_in" ? "Sudah Check-in" : "Dibatalkan"}
                    </p>
                  </div>
                  {ticket.qr_code && (
                    <div className="rounded-lg bg-brand-navy/5 px-3 py-1">
                      <p className="text-xs font-mono text-brand-navy">{ticket.qr_code.slice(0, 8)}...</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/events/${ticket.event.slug}`}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs font-medium text-brand-navy hover:bg-muted"
                  >
                    Detail Event
                  </Link>
                  <Link
                    href={`/dashboard/my-tickets`}
                    className="flex-1 rounded-lg bg-brand-blue px-3 py-2 text-center text-xs font-medium text-white hover:bg-brand-blue/90"
                  >
                    Lihat QR
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
          <p className="mt-4 text-muted-foreground">Belum ada tiket.</p>
          <Link href="/events" className="mt-4 inline-flex rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90">
            Jelajahi Event
          </Link>
        </div>
      )}
    </div>
  );
}
