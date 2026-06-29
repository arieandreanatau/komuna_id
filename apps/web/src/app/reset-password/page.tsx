"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password, password_confirmation: passwordConfirmation }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Password berhasil direset. Mengarahkan ke halaman login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Gagal mereset password");
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
          <h1 className="text-2xl font-semibold text-brand-navy">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Masukkan password baru Anda.</p>

          {message && <div className="mt-4 rounded-lg bg-brand-teal/10 p-3 text-sm text-brand-teal">{message}</div>}
          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Password Baru</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Konfirmasi Password</label>
              <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={8} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50">
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
