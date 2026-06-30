"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/constants";
import {
  Home, Users, Calendar, UserPlus, BarChart3, Settings,
  FileText, ChevronLeft, Handshake
} from "lucide-react";

const LINKS = [
  { label: "Dashboard", href: "/community-manage", icon: <Home className="h-5 w-5" /> },
  { label: "Anggota", href: "/community-manage/members", icon: <Users className="h-5 w-5" /> },
  { label: "Event", href: "/community-manage/events", icon: <Calendar className="h-5 w-5" /> },
  { label: "Permintaan Gabung", href: "/community-manage/join-requests", icon: <UserPlus className="h-5 w-5" /> },
  { label: "Analitik", href: "/community-manage/analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { label: "Relawan", href: "/community-manage/volunteer", icon: <Handshake className="h-5 w-5" /> },
  { label: "Artikel", href: "/community-manage/articles", icon: <FileText className="h-5 w-5" /> },
  { label: "Pengaturan", href: "/community-manage/settings", icon: <Settings className="h-5 w-5" /> },
];

export default function CommunityManageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Image src="/brand/icon.png" alt="KomunaID" width={28} height={28} className="h-7 w-7" />
          <span className="text-lg font-bold text-brand-navy">{BRAND.name}</span>
        </div>
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-muted-foreground">Mengelola</p>
          <p className="text-sm font-semibold text-brand-navy">ID Tech Community</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive ? "bg-brand-blue text-white shadow-sm" : "text-muted-foreground hover:bg-brand-light-gray hover:text-brand-navy"
                }`}
              >
                <span className={isActive ? "text-white" : "text-brand-blue/70"}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-navy">
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="rounded-lg bg-brand-light-gray px-3 py-2 text-sm font-medium text-brand-navy hover:bg-brand-light-gray/80">
              Lihat sebagai Member
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-brand-light-gray p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}