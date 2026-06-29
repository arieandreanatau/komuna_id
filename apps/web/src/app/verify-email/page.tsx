"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setStatus(res.ok ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-light-gray px-4">
      <div className="w-full max-w-md text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Memverifikasi email...</p>
          </div>
        )}
        {status === "success" && (
          <div className="rounded-xl border border-border bg-white p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10">
              <svg className="h-6 w-6 text-brand-teal" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-brand-navy">Email Terverifikasi</h2>
            <p className="mt-2 text-sm text-muted-foreground">Email Anda berhasil diverifikasi.</p>
            <Link href="/login" className="mt-6 inline-flex rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90">
              Masuk
            </Link>
          </div>
        )}
        {status === "error" && (
          <div className="rounded-xl border border-border bg-white p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-brand-navy">Verifikasi Gagal</h2>
            <p className="mt-2 text-sm text-muted-foreground">Link verifikasi tidak valid atau sudah kedaluwarsa.</p>
            <Link href="/login" className="mt-6 inline-flex rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90">
              Kembali ke Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-brand-light-gray">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
