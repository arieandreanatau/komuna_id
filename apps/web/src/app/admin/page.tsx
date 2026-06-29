"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardStats {
  total_users: number;
  active_users: number;
  total_communities: number;
  pending_communities: number;
  total_events: number;
  total_organizations: number;
  pending_organizations: number;
  total_brands: number;
  pending_brands: number;
  total_collaborations: number;
  pending_role_requests: number;
  total_articles: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { if (data.success) setStats(data.data.stats); })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  const cards = [
    { label: "Total Users", value: stats?.total_users || 0, color: "text-brand-blue", href: "/admin/users" },
    { label: "Komunitas Pending", value: stats?.pending_communities || 0, color: "text-brand-orange", href: "/admin/communities" },
    { label: "Organisasi Pending", value: stats?.pending_organizations || 0, color: "text-brand-orange", href: "/admin/organizations" },
    { label: "Brand Pending", value: stats?.pending_brands || 0, color: "text-brand-orange", href: "/admin/brands" },
    { label: "Role Requests", value: stats?.pending_role_requests || 0, color: "text-brand-orange", href: "/admin/role-requests" },
    { label: "Total Events", value: stats?.total_events || 0, color: "text-brand-teal", href: "/admin/events" },
    { label: "Total Articles", value: stats?.total_articles || 0, color: "text-brand-aqua", href: "/admin/cms" },
    { label: "Collaborations", value: stats?.total_collaborations || 0, color: "text-brand-teal", href: "/admin/collaborations" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${card.color}`}>{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
