"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/constants";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Tentang {BRAND.name}
            </h1>
            <p className="mt-4 text-lg text-white/80">{BRAND.tagline}</p>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-xl border border-border bg-white p-8 space-y-6">
            <h2 className="text-xl font-semibold text-brand-navy">Misi Kami</h2>
            <p className="text-muted-foreground leading-relaxed">
              {BRAND.name} adalah platform ekosistem komunitas yang menghubungkan
              individu, komunitas, organisasi, dan brand dalam satu ekosistem
              terintegrasi. Kami percaya bahwa kolaborasi adalah kunci pertumbuhan.
            </p>
            <h2 className="text-xl font-semibold text-brand-navy">Visi Kami</h2>
            <p className="text-muted-foreground leading-relaxed">
              Menjadi platform komunitas terdepan di Indonesia yang mampu
              menghubungkan, menggerakkan, dan mengembangkan potensi setiap
              komunitas dan anggotanya.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6">
              {[
                { label: "Komunitas", value: "0+" },
                { label: "Anggota", value: "0+" },
                { label: "Event", value: "0+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-lg bg-brand-light-gray">
                  <p className="text-2xl font-bold text-brand-blue">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
