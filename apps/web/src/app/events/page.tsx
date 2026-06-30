"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string | null;
  is_online: boolean;
  current_participants: number;
  max_participants: number | null;
  ticket_price: number;
  community: { name: string } | null;
  organizer: { name: string };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=12&page=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.data || []);
          setHasMore(data.meta ? data.meta.current_page < data.meta.last_page : false);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=12&page=${nextPage}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents((prev) => [...prev, ...(data.data || [])]);
          setPage(nextPage);
          setHasMore(data.meta ? data.meta.current_page < data.meta.last_page : false);
        }
      })
      .finally(() => setLoadingMore(false));
  };

  const filtered = search
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase())
      )
    : events;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <section className="bg-gradient-to-r from-brand-blue to-brand-aqua py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Jelajahi Event
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Temukan event menarik di sekitar Anda
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari event..."
                className="w-full rounded-lg border-0 px-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-12 text-center">
              <p className="text-muted-foreground">
                {search ? "Tidak ada event yang cocok." : "Belum ada event yang tersedia."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-sm font-bold text-brand-blue">
                        {new Date(event.start_date).getDate()}
                      </div>
                      {event.is_online && (
                        <span className="rounded-full bg-brand-aqua/10 px-3 py-1 text-xs font-medium text-brand-aqua">
                          Online
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-brand-navy group-hover:text-brand-blue">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDate(event.start_date)}
                    </p>
                    {event.location && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.location}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{event.current_participants} peserta</span>
                      <span className="font-semibold text-brand-teal">
                        {event.ticket_price > 0
                          ? `Rp ${event.ticket_price.toLocaleString("id-ID")}`
                          : "Gratis"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {hasMore && !search && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-medium text-brand-navy hover:bg-muted disabled:opacity-50"
                  >
                    {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
