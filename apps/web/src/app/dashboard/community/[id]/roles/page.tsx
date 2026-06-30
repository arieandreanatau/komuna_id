"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { CommunityRoleAssignment, CommunityRoleHistory, PaginationMeta } from "@/types/api";
import { CommunityRoleBadge } from "@/components/community/CommunityRoleBadge";
import { CommunityEmptyState } from "@/components/community/EmptyState";
import { LoadingState } from "@/components/community/LoadingState";
import { Pagination } from "@/components/ui/pagination";

const AVAILABLE_ROLES = [
  { value: "community-admin", label: "Community Admin" },
  { value: "event-manager", label: "Event Manager" },
  { value: "volunteer-coordinator", label: "Volunteer Coordinator" },
];

export default function CommunityRolesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assignments, setAssignments] = useState<CommunityRoleAssignment[]>([]);
  const [history, setHistory] = useState<CommunityRoleHistory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState(AVAILABLE_ROLES[0].value);
  const [formNotes, setFormNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchApi<CommunityRoleAssignment[]>(
          `/communities/${id}/roles?page=${page}&per_page=15`
        );
        setAssignments(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : null) || "Gagal memuat role");
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchAssignments();
    fetchApi<CommunityRoleHistory[]>(`/communities/${id}/roles/history?per_page=10`)
      .then((res) => setHistory(res.data))
      .catch(() => {});
  }, [id, fetchAssignments]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchApi(`/communities/${id}/roles`, {
        method: "POST",
        body: JSON.stringify({ email: formEmail, role: formRole, notes: formNotes }),
      });
      setShowForm(false);
      setFormEmail("");
      setFormRole(AVAILABLE_ROLES[0].value);
      setFormNotes("");
      fetchAssignments();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal menetapkan role");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (assignmentId: number) => {
    if (!confirm("Yakin ingin mencabut role ini?")) return;
    try {
      await fetchApi(`/communities/${id}/roles/${assignmentId}`, { method: "DELETE" });
      fetchAssignments();
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal mencabut role");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Manajemen Role</h1>
          <p className="text-sm text-muted-foreground">Kelola role anggota komunitas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90"
        >
          <UserPlus className="h-4 w-4" />
          Tetapkan Role
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAssign} className="rounded-xl border border-border bg-white p-6 space-y-4">
          <h3 className="font-semibold text-brand-navy">Tetapkan Role Baru</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-navy">Email Anggota</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-navy">Role</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus:border-brand-blue focus:outline-none"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-navy">Catatan</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              placeholder="Opsional"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90 disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : assignments.length === 0 ? (
        <CommunityEmptyState
          icon={<Shield className="h-12 w-12" />}
          title="Belum ada role ditetapkan"
          description="Tetapkan role kepada anggota komunitas."
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Pengguna</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Ditetapkan Oleh</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Catatan</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignments.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-brand-navy">{a.user.name}</p>
                        <p className="text-xs text-muted-foreground">{a.user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <CommunityRoleBadge role={a.role.slug} />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {a.assigner.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {a.notes || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRevoke(a.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Cabut
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {meta && <Pagination meta={meta} onPageChange={fetchAssignments} />}
        </>
      )}

      {history.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Riwayat Role</h2>
          <div className="mt-4 space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-brand-navy">
                    {h.user.name} — {h.action} role{" "}
                    <span className="font-semibold">{h.role.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Oleh {h.changer.name} •{" "}
                    {new Date(h.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
