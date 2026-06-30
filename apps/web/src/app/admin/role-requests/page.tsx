"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface RoleRequest {
  id: number;
  user: { name: string; email: string; username?: string };
  role: { name: string; slug: string };
  status: string;
  notes: string | null;
  created_at: string;
}

export default function AdminRoleRequestsPage() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const loadRequests = () => {
    setLoading(true);
    fetchApi<RoleRequest[]>(`/admin/role-requests?status=${filter}&per_page=50`)
      .then((res) => setRequests(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const handleApprove = async (id: number) => {
    try {
      await fetchApi(`/admin/role-requests/${id}/approve`, { method: "POST" });
      toast.success("Role request disetujui");
      loadRequests();
    } catch {
      toast.error("Gagal menyetujui role request");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetchApi(`/admin/role-requests/${id}/reject`, { method: "POST" });
      toast.success("Role request ditolak");
      loadRequests();
    } catch {
      toast.error("Gagal menolak role request");
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  const statusColors: Record<string, string> = {
    submitted: "bg-yellow-50 text-yellow-600",
    under_review: "bg-brand-blue/10 text-brand-blue",
    need_revision: "bg-brand-orange/10 text-brand-orange",
    approved: "bg-brand-teal/10 text-brand-teal",
    rejected: "bg-red-50 text-red-600",
    suspended: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-navy">Manajemen Role Requests</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-border px-4 py-2 text-sm">
          <option value="submitted">Menunggu Review</option>
          <option value="under_review">Sedang Direview</option>
          <option value="need_revision">Perlu Revisi</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-light-gray">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">User</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Role</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Status</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Tanggal</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-navy">{req.user?.name || req.user?.username}</p>
                  <p className="text-xs text-muted-foreground">{req.user?.email || ""}</p>
                </td>
                <td className="px-4 py-3 font-medium text-brand-navy">{req.role?.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[req.status] || "bg-gray-100 text-gray-600"}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(req.created_at).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3 space-x-2">
                  {(req.status === "submitted" || req.status === "under_review") && (
                    <>
                      <button onClick={() => handleApprove(req.id)} className="rounded bg-brand-teal px-3 py-1 text-xs font-medium text-white hover:bg-brand-teal/90">Setujui</button>
                      <button onClick={() => handleReject(req.id)} className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && <p className="p-8 text-center text-muted-foreground">Tidak ada data.</p>}
      </div>
    </div>
  );
}
