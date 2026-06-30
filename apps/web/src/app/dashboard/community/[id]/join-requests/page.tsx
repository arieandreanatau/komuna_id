"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { CheckCircle, XCircle, Filter } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { PaginationMeta } from "@/types/api";
import { CommunityEmptyState } from "@/components/community/EmptyState";
import { LoadingState } from "@/components/community/LoadingState";
import { Pagination } from "@/components/ui/pagination";

interface JoinRequest {
  id: number;
  user: { id: number; name: string; email: string };
  status: "pending" | "approved" | "rejected";
  message: string | null;
  created_at: string;
}

export default function JoinRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchRequests = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ page: String(page), per_page: "15" });
        if (statusFilter) qs.set("status", statusFilter);
        const res = await fetchApi<JoinRequest[]>(
          `/communities/${id}/join-requests?${qs.toString()}`
        );
        setRequests(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : null) || "Gagal memuat permintaan join");
      } finally {
        setLoading(false);
      }
    },
    [id, statusFilter]
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (requestId: number) => {
    try {
      await fetchApi(`/communities/${id}/join-requests/${requestId}/approve`, { method: "POST" });
      fetchRequests();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal menyetujui permintaan");
    }
  };

  const handleReject = async (requestId: number) => {
    if (!confirm("Yakin ingin menolak permintaan ini?")) return;
    try {
      await fetchApi(`/communities/${id}/join-requests/${requestId}/reject`, { method: "POST" });
      fetchRequests();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal menolak permintaan");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Permintaan Join</h1>
        <p className="text-sm text-muted-foreground">Kelola permintaan bergabung ke komunitas</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-sm focus:border-brand-blue focus:outline-none"
        >
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
          <option value="">Semua</option>
        </select>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <CommunityEmptyState
          title="Tidak ada permintaan"
          description="Tidak ada permintaan join yang ditemukan."
        />
      ) : (
        <>
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-border bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-brand-navy">{req.user.name}</p>
                    <p className="text-sm text-muted-foreground">{req.user.email}</p>
                    {req.message && (
                      <p className="mt-2 text-sm text-muted-foreground italic">
                        &ldquo;{req.message}&rdquo;
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(req.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Tolak
                      </button>
                    </div>
                  )}
                  {req.status !== "pending" && (
                    <span className={`text-xs font-medium ${
                      req.status === "approved" ? "text-green-600" : "text-red-600"
                    }`}>
                      {req.status === "approved" ? "Disetujui" : "Ditolak"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {meta && <Pagination meta={meta} onPageChange={fetchRequests} />}
        </>
      )}
    </div>
  );
}
