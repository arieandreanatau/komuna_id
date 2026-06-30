"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { ClipboardList, Filter } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { PaginationMeta } from "@/types/api";
import { CommunityEmptyState } from "@/components/community/EmptyState";
import { LoadingState } from "@/components/community/LoadingState";
import { Pagination } from "@/components/ui/pagination";

interface AuditLogEntry {
  id: number;
  user: { id: number; name: string; email: string };
  action: string;
  auditable_type: string;
  auditable_id: number;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

const ACTION_FILTERS = [
  { value: "", label: "Semua Aksi" },
  { value: "created", label: "Dibuat" },
  { value: "updated", label: "Diperbarui" },
  { value: "deleted", label: "Dihapus" },
  { value: "member_joined", label: "Anggota Bergabung" },
  { value: "member_removed", label: "Anggota Dikeluarkan" },
  { value: "role_assigned", label: "Role Ditetapkan" },
  { value: "role_revoked", label: "Role Dicabut" },
];

export default function AuditLogsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState("");

  const fetchLogs = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ page: String(page), per_page: "20" });
        if (actionFilter) qs.set("action", actionFilter);
        const res = await fetchApi<AuditLogEntry[]>(
          `/communities/${id}/audit-logs?${qs.toString()}`
        );
        setLogs(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : null) || "Gagal memuat log aktivitas");
      } finally {
        setLoading(false);
      }
    },
    [id, actionFilter]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatTimestamp = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Log Aktivitas</h1>
        <p className="text-sm text-muted-foreground">Riwayat aktivitas dalam komunitas</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-sm focus:border-brand-blue focus:outline-none"
        >
          {ACTION_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <CommunityEmptyState
          icon={<ClipboardList className="h-12 w-12" />}
          title="Belum ada log aktivitas"
          description="Aktivitas dalam komunitas akan tercatat di sini."
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Waktu</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Pengguna</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Aksi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Detail</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                        {formatTimestamp(log.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-brand-navy">{log.user.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-medium text-brand-blue">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {log.auditable_type}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {log.ip_address || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {meta && <Pagination meta={meta} onPageChange={fetchLogs} />}
        </>
      )}
    </div>
  );
}
