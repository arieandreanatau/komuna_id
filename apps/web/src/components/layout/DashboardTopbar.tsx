"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BRAND } from "@/constants";
import { getToken, removeToken, fetchApi } from "@/lib/api";
import type { AuthUser } from "@/types/api";
import {Bell, ChevronDown} from "lucide-react";

export function DashboardTopbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchApi<AuthUser>("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    const token = getToken();
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    removeToken();
    window.location.href = "/login";
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/brand/icon.png" alt="KomunaID" width={28} height={28} className="h-7 w-7" />
          <span className="text-lg font-bold text-brand-navy">{BRAND.name}</span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-2">
        <Image src="/brand/icon.png" alt="KomunaID" width={24} height={24} className="h-6 w-6" />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/notifications"
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-brand-light-gray hover:text-brand-navy"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-orange" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-brand-light-gray"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-brand-navy sm:block">
              {user?.name || "Akun Saya"}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-white py-1 shadow-lg">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-brand-navy">{user?.name || "Pengguna"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-brand-light-gray"
                  onClick={() => setMenuOpen(false)}
                >
                  Profil Saya
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-brand-light-gray"
                  onClick={() => setMenuOpen(false)}
                >
                  Pengaturan
                </Link>
                <hr className="my-1 border-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}