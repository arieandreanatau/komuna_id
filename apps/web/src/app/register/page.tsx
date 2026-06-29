"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/constants";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];
          setError(firstError as string);
        } else {
          setError(data.message || "Gagal mendaftar");
        }
        return;
      }

      localStorage.setItem("auth_token", data.data.token);
      setSuccess("Registrasi berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-brand-navy via-brand-blue to-brand-teal lg:flex lg:items-center lg:justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-white">{BRAND.name}</h1>
          <p className="mt-4 text-lg text-brand-aqua">{BRAND.tagline}</p>
          <p className="mt-2 text-sm text-white/70">
            Bergabung dengan ribuan komunitas di seluruh Indonesia
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-2xl font-semibold text-brand-navy">
              {BRAND.name}
            </h1>
            <p className="text-sm text-brand-blue">{BRAND.tagline}</p>
          </div>

          <h2 className="text-2xl font-semibold text-brand-navy">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-brand-blue hover:underline">
              Masuk
            </Link>
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg bg-brand-teal/10 p-3 text-sm text-brand-teal">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-brand-navy"
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-navy"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="email@contoh.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-navy"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="Minimal 8 karakter"
              />
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-brand-navy"
              >
                Konfirmasi Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={8}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                placeholder="Ulangi password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
