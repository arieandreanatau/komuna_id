"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { Community } from "@/types/api";
import { CommunityRoleBadge } from "@/components/community/CommunityRoleBadge";
import { CommunityStatusBadge } from "@/components/community/CommunityStatusBadge";
import { CommunityEmptyState } from "@/components/community/EmptyState";
import { LoadingState } from "@/components/community/LoadingState";

interface MyCommunityItem extends Community {
  my_role: string;
}

export default function CommunityListPage() {
  const [communities, setCommunities] = useState<MyCommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<MyCommunityItem[]>("/me/communities")
      .then((res) => setCommunities(res.data))
      .catch((err) => setError(err.message || "Gagal memuat komunitas"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Komunitas Saya</h1>
          <p className="text-sm text-muted-foreground">
            Kelola komunitas yang Anda ikuti
          </p>
        </div>
        <Link
          href="/communities/create"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-blue/90"
        >
          <Plus className="h-4 w-4" />
          Buat Komunitas
        </Link>
      </div>

      {communities.length === 0 ? (
        <CommunityEmptyState
          icon={<Users className="h-12 w-12" />}
          title="Belum ada komunitas"
          description="Anda belum bergabung dengan komunitas manapun. Mulai dengan membuat atau bergabung ke komunitas."
          action={
            <Link
              href="/communities"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90"
            >
              Jelajahi Komunitas
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/dashboard/community/${community.id}/overview`}
              className="group rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-brand-navy group-hover:text-brand-blue">
                  {community.name}
                </h3>
                <CommunityStatusBadge status={community.status} />
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {community.description || "Tidak ada deskripsi"}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <CommunityRoleBadge role={community.my_role} />
                <span className="text-xs text-muted-foreground">
                  {community.members_count || 0} anggota
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
