"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Link reset password telah dikirim ke email Anda.");
      } else {
        setError(data.message || "Gagal mengirim link reset");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-brand-light-gray px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold text-brand-navy">Lupa Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan email Anda untuk menerima link reset password.
          </p>

          {message && <div className="mt-4 rounded-lg bg-brand-teal/10 p-3 text-sm text-brand-teal">{message}</div>}
          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="email@contoh.com" />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50">
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
