"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

interface AdminEvent {
  id: number;
  title: string;
  slug: string;
  start_date: string;
  status: string;
  current_participants: number;
  community: { name: string } | null;
  organizer: { name: string };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<AdminEvent[]>("/admin/events?per_page=50")
      .then((res) => setEvents(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Manajemen Event</h1>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-light-gray">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Judul</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Komunitas</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Tanggal</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Peserta</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{event.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{event.community?.name || "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(event.start_date).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3 text-muted-foreground">{event.current_participants}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    event.status === "published" ? "bg-brand-teal/10 text-brand-teal" :
                    event.status === "draft" ? "bg-gray-100 text-gray-600" :
                    "bg-brand-orange/10 text-brand-orange"
                  }`}>{event.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <p className="p-8 text-center text-muted-foreground">Tidak ada data.</p>}
      </div>
    </div>
  );
}
