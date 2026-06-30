"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function FriendsPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Teman</h1>
        <p className="text-sm text-muted-foreground">Kelola pertemanan Anda</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10">
          <svg className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-brand-navy">Fitur Pertemanan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fitur pertemanan sedang dalam pengembangan. Segera hadir untuk menghubungkan Anda dengan anggota komunitas lainnya.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
            Coming Soon
          </span>
        </div>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-brand-navy hover:bg-muted">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
