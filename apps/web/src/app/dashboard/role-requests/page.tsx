"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { fetchApi } from "@/lib/api";
import { useState, useEffect } from "react";
import type { RoleRequest, Role } from "@/types/api";

export default function RoleRequestsPage() {
  const {_user, loading: authLoading} = useAuth();
  const { data, loading, error, execute } = useApi<{ data: RoleRequest[] }>("/me/role-requests");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetchApi<{ data: Role[] }>("/roles")
      .then((res) => setRoles(res.data.data || []))
      .catch(() => {});
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setSubmitting(true);
    setMessage("");

    try {
      await fetchApi("/me/role-requests", {
        method: "POST",
        body: JSON.stringify({ role_id: Number(selectedRole) }),
      });
      setMessage("Pengajuan role berhasil dikirim");
      setMessageType("success");
      setSelectedRole("");
      execute();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessage(error.message || "Gagal mengirim pengajuan");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const requests = data?.data || [];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-600",
    approved: "bg-brand-teal/10 text-brand-teal",
    rejected: "bg-red-50 text-red-600",
    revision: "bg-brand-blue/10 text-brand-blue",
  };

  const statusLabels: Record<string, string> = {
    pending: "Menunggu Review",
    approved: "Disetujui",
    rejected: "Ditolak",
    revision: "Perlu Revisi",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Permintaan Role</h1>
        <p className="text-sm text-muted-foreground">Ajukan permintaan role baru dan pantau statusnya</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Ajukan Role Baru</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="">Pilih role yang ingin diajukan</option>
            {roles
              .filter((r) => r.scope !== "platform" || r.slug === "member")
              .map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
          </select>
          <button
            type="submit"
            disabled={submitting || !selectedRole}
            className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
          >
            {submitting ? "Mengirim..." : "Ajukan"}
          </button>
        </form>

        {message && (
          <div className={`mt-3 rounded-lg p-3 text-sm ${messageType === "success" ? "bg-brand-teal/10 text-brand-teal" : "bg-red-50 text-red-600"}`}>
            {message}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-brand-navy">{req.role.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Diajukan {new Date(req.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {req.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">Catatan: {req.notes}</p>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[req.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabels[req.status] || req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <p className="mt-4 text-muted-foreground">Belum ada permintaan role.</p>
        </div>
      )}
    </div>
  );
}
