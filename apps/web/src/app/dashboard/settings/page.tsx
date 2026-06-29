"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola pengaturan akun Anda</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Ubah Password</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy">Password Lama</label>
            <input type="password" className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy">Password Baru</label>
            <input type="password" className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy">Konfirmasi Password Baru</label>
            <input type="password" className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
          </div>
          <button className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90">
            Ubah Password
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-red-600">Zona Bahaya</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tindakan yang tidak dapat dibatalkan.
        </p>
        <button className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
          Hapus Akun
        </button>
      </div>
    </div>
  );
}
