"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, UserPlus, Shield, Calendar,
  BarChart3, Bell, Settings, ClipboardList, MessageCircle, Handshake,
  Wallet, Store, Image, ChevronLeft,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { Community } from "@/types/api";
import { CommunityRoleBadge } from "@/components/community/CommunityRoleBadge";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  placeholder?: boolean;
}

function getCommunityLinks(id: string): SidebarLink[] {
  const base = `/dashboard/community/${id}`;
  return [
    { label: "Overview", href: `${base}/overview`, icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Profil", href: `${base}/profile`, icon: <FileText className="h-4 w-4" /> },
    { label: "Anggota", href: `${base}/members`, icon: <Users className="h-4 w-4" /> },
    { label: "Permintaan Join", href: `${base}/join-requests`, icon: <UserPlus className="h-4 w-4" /> },
    { label: "Role", href: `${base}/roles`, icon: <Shield className="h-4 w-4" /> },
    { label: "Event", href: `${base}/events`, icon: <Calendar className="h-4 w-4" /> },
    { label: "Laporan", href: `${base}/reports`, icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Notifikasi", href: `${base}/notifications`, icon: <Bell className="h-4 w-4" /> },
    { label: "Pengaturan", href: `${base}/settings`, icon: <Settings className="h-4 w-4" /> },
    { label: "Log Aktivitas", href: `${base}/audit-logs`, icon: <ClipboardList className="h-4 w-4" /> },
    { label: "Diskusi", href: "#", icon: <MessageCircle className="h-4 w-4" />, placeholder: true },
    { label: "Relawan", href: "#", icon: <Users className="h-4 w-4" />, placeholder: true },
    { label: "Kolaborasi", href: "#", icon: <Handshake className="h-4 w-4" />, placeholder: true },
    { label: "Keuangan", href: "#", icon: <Wallet className="h-4 w-4" />, placeholder: true },
    { label: "Marketplace", href: "#", icon: <Store className="h-4 w-4" />, placeholder: true },
    { label: "Media", href: "#", icon: <Image className="h-4 w-4" />, placeholder: true },
  ];
}

export default function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const [communityId, setCommunityId] = useState<string>("");
  const [community, setCommunity] = useState<Community | null>(null);
  const [myRole, setMyRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setCommunityId(p.id));
  }, [params]);

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    Promise.all([
      fetchApi<Community>(`/communities/${communityId}`),
      fetchApi<{ role: string }>(`/communities/${communityId}/my-role`),
    ])
      .then(([commRes, roleRes]) => {
        setCommunity(commRes.data);
        setMyRole(roleRes.data.role);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [communityId]);

  const links = communityId ? getCommunityLinks(communityId) : [];

  return (
    <div className="flex gap-6">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 space-y-4">
          <Link
            href="/dashboard/community"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-navy"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </Link>

          {!loading && community && (
            <div className="rounded-xl border border-border bg-white p-4">
              <h2 className="font-semibold text-brand-navy line-clamp-1">
                {community.name}
              </h2>
              {myRole && (
                <div className="mt-2">
                  <CommunityRoleBadge role={myRole} />
                </div>
              )}
            </div>
          )}

          <nav className="space-y-0.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.placeholder ? "#" : link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-blue text-white"
                      : link.placeholder
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-muted-foreground hover:bg-brand-light-gray hover:text-brand-navy"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-brand-blue/70"}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
