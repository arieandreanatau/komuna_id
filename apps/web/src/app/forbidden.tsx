"use client";

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-light-gray px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-orange">403</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Akses ditolak.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue/90"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
