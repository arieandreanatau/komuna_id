"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        toast.success("Pesan berhasil dikirim! Kami akan segera merespon.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Hubungi Kami
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Punya pertanyaan? Kami siap membantu.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-2xl px-4 py-12">
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-navy">Nama</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Nama Anda" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="email@contoh.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Subjek</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Subjek pesan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Pesan</label>
              <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Tuliskan pesan Anda..." />
            </div>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50">
              {submitting ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
