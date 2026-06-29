"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  total_users: number;
  total_communities: number;
  total_events: number;
  pending_communities: number;
  pending_organizations: number;
  pending_brands: number;
  total_articles: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            total_users: 1,
            total_communities: 0,
            total_events: 0,
            pending_communities: 0,
            pending_organizations: 0,
            pending_brands: 0,
            total_articles: 0,
          });
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

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
        <h1 className="text-2xl font-semibold text-brand-navy">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di KomunaID
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Komunitas", value: stats?.total_communities || 0, color: "text-brand-blue" },
          { label: "Event", value: stats?.total_events || 0, color: "text-brand-teal" },
          { label: "Artikel", value: stats?.total_articles || 0, color: "text-brand-aqua" },
          { label: "Menunggu Review", value: (stats?.pending_communities || 0) + (stats?.pending_organizations || 0) + (stats?.pending_brands || 0), color: "text-brand-orange" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-white p-6"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Aktivitas Terbaru</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Belum ada aktivitas terbaru.
        </p>
      </div>
    </div>
  );
}
