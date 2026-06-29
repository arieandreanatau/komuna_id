"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

const FAQ_DATA = [
  { q: "Apa itu KomunaID?", a: "KomunaID adalah platform ekosistem komunitas yang menghubungkan individu, komunitas, organisasi, dan brand dalam satu ekosistem terintegrasi." },
  { q: "Bagaimana cara mendaftar?", a: "Klik tombol Daftar, isi formulir registrasi dengan nama, email, dan password. Setelah itu Anda sudah bisa menggunakan platform." },
  { q: "Apakah gratis menggunakan KomunaID?", a: "Ya, mendaftar dan menggunakan KomunaID adalah gratis. Beberapa event mungkin memiliki tiket berbayar sesuai kebijakan penyelenggara." },
  { q: "Bagaimana cara bergabung dengan komunitas?", a: "Buka halaman Komunitas, cari komunitas yang Anda minati, lalu klik Gabung. Beberapa komunitas membutuhkan persetujuan dari admin." },
  { q: "Bagaimana cara membuat event?", a: "Anda perlu menjadi anggota atau admin komunitas terlebih dahulu. Setelah itu, buka dashboard komunitas dan klik Buat Event." },
  { q: "Bagaimana cara menghubungi support?", a: "Anda bisa mengirim pesan melalui halaman Hubungi Kami atau email ke support@komuna.id." },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Frequently Asked Questions
            </h1>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="space-y-3">
            {FAQ_DATA.map((faq, index) => (
              <div key={index} className="rounded-xl border border-border bg-white">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-brand-navy">{faq.q}</span>
                  <svg
                    className={`h-5 w-5 text-muted-foreground transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="border-t border-border px-5 pb-5 pt-3">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
