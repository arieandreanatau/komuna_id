"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BRAND } from "@/constants";
import { fetchApi } from "@/lib/api";
import type { AuthUser } from "@/types/api";
import {
  Home, User, Users, Calendar, Ticket, Heart, Shield, Bell, Settings, Building, Star, Handshake, FileText, List, LogOut, ChevronLeft, ChevronRight, Flag, FileCheck
} from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const MEMBER_LINKS: SidebarLink[] = [
  { label: "Beranda", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
  { label: "Komunitas Saya", href: "/dashboard/my-communities", icon: <Users className="h-5 w-5" /> },
  { label: "Event Saya", href: "/dashboard/my-events", icon: <Calendar className="h-5 w-5" /> },
  { label: "Tiket Saya", href: "/dashboard/my-tickets", icon: <Ticket className="h-5 w-5" /> },
  { label: "Favorit", href: "/dashboard/favorites", icon: <Heart className="h-5 w-5" /> },
  { label: "Permintaan Role", href: "/dashboard/role-requests", icon: <Shield className="h-5 w-5" /> },
  { label: "Laporan", href: "/dashboard/reports", icon: <Flag className="h-5 w-5" /> },
  { label: "Notifikasi", href: "/dashboard/notifications", icon: <Bell className="h-5 w-5" /> },
  { label: "Pengaturan", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
];

const ADMIN_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/admin", icon: <Home className="h-5 w-5" /> },
  { label: "Persetujuan", href: "/admin/role-requests", icon: <FileCheck className="h-5 w-5" /> },
  { label: "Komunitas", href: "/admin/communities", icon: <Users className="h-5 w-5" /> },
  { label: "Organisasi", href: "/admin/organizations", icon: <Building className="h-5 w-5" /> },
  { label: "Brand & Mitra", href: "/admin/brands", icon: <Star className="h-5 w-5" /> },
  { label: "Event", href: "/admin/events", icon: <Calendar className="h-5 w-5" /> },
  { label: "Kolaborasi", href: "/admin/collaborations", icon: <Handshake className="h-5 w-5" /> },
  { label: "Pengguna", href: "/admin/users", icon: <User className="h-5 w-5" /> },
  { label: "CMS", href: "/admin/cms", icon: <FileText className="h-5 w-5" /> },
  { label: "Audit Log", href: "/admin/audit-logs", icon: <List className="h-5 w-5" /> },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    fetchApi<AuthUser>("/auth/me")
      .then((res) => {
        const adminSlugs = ["super-admin", "admin", "platform-admin"];
        setIsAdmin(res.data.roles?.some((r) => adminSlugs.includes(r.slug)) || false);
      })
      .catch(() => {});
  }, []);

  const isAdminPage = pathname.startsWith("/admin");
  const links = isAdminPage ? ADMIN_LINKS : MEMBER_LINKS;

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-border bg-white transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      <div className={`flex h-16 items-center border-b border-border px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/brand/icon.png"
              alt="KomunaID"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-lg font-bold text-brand-navy">{BRAND.name}</span>
          </Link>
        )}
        {collapsed && (
          <Image
            src="/brand/icon.png"
            alt="KomunaID"
            width={28}
            height={28}
            className="h-7 w-7"
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-brand-light-gray hover:text-brand-navy ${collapsed ? "hidden" : ""}`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {collapsed && (
        <div className="flex justify-center border-b border-border py-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-brand-light-gray hover:text-brand-navy"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-muted-foreground hover:bg-brand-light-gray hover:text-brand-navy"
              }`}
              title={collapsed ? link.label : undefined}
            >
              <span className={isActive ? "text-white" : "text-brand-blue/70"}>{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}

        {!isAdminPage && isAdmin && (
          <>
            <div className="my-2 border-t border-border" />
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-muted-foreground hover:bg-brand-light-gray hover:text-brand-navy"
              title={collapsed ? "Admin Panel" : undefined}
            >
              <span className="text-brand-orange"><Shield className="h-5 w-5" /></span>
              {!collapsed && <span>Admin Panel</span>}
            </Link>
          </>
        )}
      </nav>

      <div className="border-t border-border p-2">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
          title={collapsed ? "Keluar" : undefined}
          onClick={() => {
            localStorage.removeItem("auth_token");
          }}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Keluar</span>}
        </Link>
      </div>
    </aside>
  );
}