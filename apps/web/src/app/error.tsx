"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-light-gray px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-orange">500</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Terjadi kesalahan internal.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tim kami telah diberitahu tentang masalah ini.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue/90"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-muted"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
