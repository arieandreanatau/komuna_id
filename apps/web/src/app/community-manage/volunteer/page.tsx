"use client";

import {
  Handshake, Users, Calendar, Heart, Award, Clock, Bell, Sparkles
} from "lucide-react";

const FEATURES = [
  { icon: <Users className="h-6 w-6" />, title: "Rekrut Relawan", description: "Temukan dan kelola relawan untuk event komunitas Anda." },
  { icon: <Calendar className="h-6 w-6" />, title: "Jadwal Otomatis", description: "Sistem penjadwalan otomatis untuk分配 tugas relawan." },
  { icon: <Heart className="h-6 w-6" />, title: "Pelacakan Kontribusi", description: "Pantau kontribusi dan jam kerja setiap relawan." },
  { icon: <Award className="h-6 w-6" />, title: "Sertifikat & Reward", description: "Berikan penghargaan kepada relawan terbaik." },
  { icon: <Clock className="h-6 w-6" />, title: "Manajemen Waktu", description: "Tools untuk mengelola shift dan rotasi relawan." },
  { icon: <Bell className="h-6 w-6" />, title: "Notifikasi Cerdas", description: "Pengingat otomatis untuk jadwal dan tugas relawan." },
];

export default function VolunteerPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="max-w-2xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-blue to-brand-teal shadow-lg">
          <Handshake className="h-12 w-12 text-white" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-brand-navy">
          Relawan Komunitas Segera Hadir!
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Fitur manajemen relawan sedang dalam pengembangan. Nantikan pembaruan terbaru dari KomunaID.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-orange">
          <Sparkles className="h-4 w-4" />
          Coming Soon
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-white p-5 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                {feature.icon}
              </div>
              <h3 className="mt-3 font-semibold text-brand-navy">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 shadow-md">
            <Bell className="h-4 w-4" />
            Beritahu Saya Saat Tersedia
          </button>
        </div>
      </div>
    </div>
  );
}
