"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/constants";

export function DashboardTopbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4 lg:hidden">
        <Link href="/dashboard" className="text-lg font-semibold text-brand-navy">
          {BRAND.name}
        </Link>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
              A
            </div>
            <span className="hidden text-sm font-medium text-brand-navy sm:block">
              Admin
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-white py-1 shadow-lg">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                Profil Saya
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                Pengaturan
              </Link>
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  window.location.href = "/login";
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-muted"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
