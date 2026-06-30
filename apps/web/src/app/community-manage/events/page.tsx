"use client";

import { useState } from "react";
import {
  Calendar, Plus, Search, MapPin, Users, Clock, Eye, Edit, Trash2,
  MoreVertical, ChevronRight
} from "lucide-react";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Workshop React Advanced",
    date: "15 Jul 2026",
    time: "09:00 - 12:00",
    location: "TechPark Jakarta",
    participants: 45,
    maxParticipants: 50,
    status: "published",
    description: "Pelajari fitur terbaru React termasuk Server Components dan Suspense."
  },
  {
    id: 2,
    title: "Tech Talk: Cloud Computing",
    date: "20 Jul 2026",
    time: "14:00 - 16:00",
    location: "Online (Zoom)",
    participants: 30,
    maxParticipants: 40,
    status: "published",
    description: "Diskusi tentang arsitektur cloud untuk aplikasi skala besar."
  },
  {
    id: 3,
    title: "Community Meetup Juni",
    date: "30 Jun 2026",
    time: "18:00 - 21:00",
    location: "CoWork Space Bandung",
    participants: 0,
    maxParticipants: 100,
    status: "draft",
    description: "Meetup bulanan komunitas untuk networking dan sharing."
  },
  {
    id: 4,
    title: "Hackathon 2026",
    date: "05 Jul 2026",
    time: "08:00 - 22:00",
    location: "Gedung Serbaguna",
    participants: 60,
    maxParticipants: 60,
    status: "cancelled",
    description: "Hackathon tahunan dengan tema solving real-world problems."
  },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  published: { label: "Diterbitkan", className: "bg-brand-teal/10 text-brand-teal" },
  draft: { label: "Draft", className: "bg-brand-orange/10 text-brand-orange" },
  cancelled: { label: "Dibatalkan", className: "bg-red-50 text-red-500" },
};

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filtered = MOCK_EVENTS.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Event Komunitas</h1>
          <p className="text-sm text-muted-foreground">Kelola semua event ID Tech Community</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90">
          <Plus className="h-4 w-4" />
          Buat Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Event", value: MOCK_EVENTS.length, color: "text-brand-blue" },
          { label: "Diterbitkan", value: MOCK_EVENTS.filter((e) => e.status === "published").length, color: "text-brand-teal" },
          { label: "Draft", value: MOCK_EVENTS.filter((e) => e.status === "draft").length, color: "text-brand-orange" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((event) => {
          const status = STATUS_CONFIG[event.status];
          return (
            <div key={event.id} className="rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-brand-navy">{event.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-brand-blue" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-brand-blue" />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-brand-blue" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === event.id ? null : event.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-brand-light-gray"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {openMenu === event.id && (
                    <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-border bg-white py-1 shadow-lg">
                      <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-light-gray">
                        <Eye className="h-4 w-4 text-brand-blue" /> Lihat
                      </button>
                      <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-light-gray">
                        <Edit className="h-4 w-4 text-brand-teal" /> Edit
                      </button>
                      <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-brand-navy">{event.participants}</span>/{event.maxParticipants} peserta
                  </span>
                  <div className="h-2 w-24 rounded-full bg-brand-light-gray ml-2">
                    <div
                      className="h-2 rounded-full bg-brand-blue transition-all"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>
                <button className="text-sm font-semibold text-brand-blue hover:underline">
                  Kelola <ChevronRight className="inline h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
