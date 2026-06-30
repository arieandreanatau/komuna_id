"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchApi, getToken } from "@/lib/api";

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string | null;
  is_online: boolean;
  online_url: string | null;
  current_participants: number;
  max_participants: number | null;
  ticket_price: number;
  currency: string;
  community: { name: string; slug: string } | null;
  organizer: { name: string };
  tickets: Array<{ id: number; name: string; price: number; quantity: number; sold: number }>;
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEvent(data.data);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    const token = getToken();
    if (!token || !event) return;
    fetchApi<{ data: Array<{ event_id: number; status: string }> }>(`/me/events`)
      .then((res) => {
        const registrations = res.data?.data || [];
        setIsRegistered(registrations.some((r) => r.event_id === event.id && r.status !== "cancelled"));
      })
      .catch(() => {});
  }, [event]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleRegister = async () => {
    if (!event) return;
    setRegistering(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Silakan login terlebih dahulu");
        setMessageType("error");
        return;
      }

      await fetchApi(`/events/${event.id}/register`, { method: "POST" });
      setMessage("Berhasil terdaftar di event!");
      setMessageType("success");
      setIsRegistered(true);
      setEvent({ ...event, current_participants: event.current_participants + 1 });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessage(error.message || "Gagal mendaftar");
      setMessageType("error");
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!event) return;
    setRegistering(true);
    setMessage("");

    try {
      await fetchApi(`/events/${event.id}/cancel-registration`, { method: "POST" });
      setMessage("Pendaftaran dibatalkan");
      setMessageType("success");
      setIsRegistered(false);
      setEvent({ ...event, current_participants: Math.max(0, event.current_participants - 1) });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessage(error.message || "Gagal membatalkan");
      setMessageType("error");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-muted-foreground">Event tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );
  }

  const isFull = event.max_participants !== null && event.current_participants >= event.max_participants;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="bg-gradient-to-r from-brand-blue to-brand-teal py-16">
          <div className="mx-auto max-w-4xl px-4">
            {event.community && (
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs text-white">
                {event.community.name}
              </span>
            )}
            <h1 className="mt-4 text-3xl font-semibold text-white">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
              <span>{formatDate(event.start_date)}</span>
              {event.location && <span>{event.location}</span>}
              {event.is_online && (
                <span className="rounded-full bg-brand-aqua/20 px-3 py-0.5 text-xs text-brand-aqua">
                  Online
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Deskripsi</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-navy">
                    {event.ticket_price > 0
                      ? `Rp ${event.ticket_price.toLocaleString("id-ID")}`
                      : "Gratis"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">per tiket</p>
                </div>

                {message && (
                  <div className={`mt-3 rounded-lg p-3 text-sm ${messageType === "success" ? "bg-brand-teal/10 text-brand-teal" : "bg-red-50 text-red-600"}`}>
                    {message}
                  </div>
                )}

                {isRegistered ? (
                  <div className="mt-4 space-y-2">
                    <div className="rounded-lg bg-brand-teal/10 p-3 text-center">
                      <p className="text-sm font-medium text-brand-teal">Anda sudah terdaftar</p>
                    </div>
                    <button
                      onClick={handleCancel}
                      disabled={registering}
                      className="w-full rounded-lg border border-red-300 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {registering ? "Memproses..." : "Batalkan Pendaftaran"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || isFull}
                    className="mt-4 w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
                  >
                    {registering ? "Memproses..." : isFull ? "Penuh" : "Daftar Sekarang"}
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="text-sm font-semibold text-brand-navy">Detail Event</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Mulai</dt>
                    <dd className="text-right font-medium text-brand-navy">{formatDate(event.start_date)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Selesai</dt>
                    <dd className="text-right font-medium text-brand-navy">{formatDate(event.end_date)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Peserta</dt>
                    <dd className="font-medium text-brand-navy">
                      {event.current_participants}
                      {event.max_participants && ` / ${event.max_participants}`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Penyelenggara</dt>
                    <dd className="font-medium text-brand-navy">{event.organizer.name}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
