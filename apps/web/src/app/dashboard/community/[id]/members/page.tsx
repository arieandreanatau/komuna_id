"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { Search, ShieldAlert, UserMinus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { CommunityMember, PaginationMeta } from "@/types/api";
import { CommunityRoleBadge } from "@/components/community/CommunityRoleBadge";
import { CommunityEmptyState } from "@/components/community/EmptyState";
import { LoadingState } from "@/components/community/LoadingState";
import { Pagination } from "@/components/ui/pagination";

export default function CommunityMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchMembers = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page), per_page: "15" });
        if (search) params.set("search", search);
        if (statusFilter) params.set("status", statusFilter);
        const res = await fetchApi<CommunityMember[]>(
          `/communities/${id}/members?${params.toString()}`
        );
        setMembers(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : null) || "Gagal memuat anggota");
      } finally {
        setLoading(false);
      }
    },
    [id, search, statusFilter]
  );

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRemove = async (memberId: number) => {
    if (!confirm("Yakin ingin mengeluarkan anggota ini?")) return;
    try {
      await fetchApi(`/communities/${id}/members/${memberId}`, { method: "DELETE" });
      fetchMembers();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal mengeluarkan anggota");
    }
  };

  const handleBan = async (memberId: number) => {
    if (!confirm("Yakin ingin memblokir anggota ini?")) return;
    try {
      await fetchApi(`/communities/${id}/members/${memberId}/ban`, { method: "POST" });
      fetchMembers();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal memblokir anggota");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Anggota Komunitas</h1>
        <p className="text-sm text-muted-foreground">Kelola anggota komunitas Anda</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari anggota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-sm focus:border-brand-blue focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
          <option value="banned">Diblokir</option>
        </select>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : members.length === 0 ? (
        <CommunityEmptyState
          title="Tidak ada anggota"
          description="Belum ada anggota yang ditemukan."
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Bergabung</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-brand-navy">{member.user?.name || "Pengguna"}</p>
                        <p className="text-xs text-muted-foreground">{member.user?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <CommunityRoleBadge role={member.role} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${
                          member.status === "active" ? "text-green-600" :
                          member.status === "banned" ? "text-red-600" : "text-muted-foreground"
                        }`}>
                          {member.status === "active" ? "Aktif" :
                           member.status === "banned" ? "Diblokir" : member.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(member.joined_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRemove(member.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                          >
                            <UserMinus className="h-3 w-3" />
                            Keluarkan
                          </button>
                          <button
                            onClick={() => handleBan(member.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <ShieldAlert className="h-3 w-3" />
                            Blokir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {meta && <Pagination meta={meta} onPageChange={fetchMembers} />}
        </>
      )}
    </div>
  );
}
