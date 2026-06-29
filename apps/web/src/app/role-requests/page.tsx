"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Role {
  id: number;
  name: string;
  slug: string;
  scope: string;
}

export default function RoleRequestsPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [myRequests, setMyRequests] = useState<{ id: number; role: { name: string }; status: string; notes: string | null; created_at: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/role-requests`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([rolesData, requestsData]) => {
      if (rolesData.success) setRoles(rolesData.data || []);
      if (requestsData.success) setMyRequests(requestsData.data || []);
    }).finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setSubmitting(true);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/role-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role_id: selectedRole, notes }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Permintaan role berhasil dikirim!");
        setSelectedRole("");
        setNotes("");
      } else {
        setMessage(data.message || "Gagal mengirim permintaan");
      }
    } catch {
      setMessage("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray py-12">
        <div className="mx-auto max-w-2xl px-4 space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-brand-navy">Permintaan Role</h1>
            <p className="text-sm text-muted-foreground">Ajukan role baru untuk mengakses fitur tambahan</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy">Role yang Diminta</label>
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm">
                <option value="">Pilih role...</option>
                {roles.filter(r => r.slug !== 'member').map((role) => (
                  <option key={role.id} value={role.id}>{role.name} ({role.scope})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Catatan</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm" placeholder="Jelaskan mengapa Anda membutuhkan role ini..." />
            </div>
            {message && <div className={`rounded-lg p-3 text-sm ${message.includes("berhasil") ? "bg-brand-teal/10 text-brand-teal" : "bg-red-50 text-red-600"}`}>{message}</div>}
            <button onClick={handleSubmit} disabled={submitting || !selectedRole} className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50">
              {submitting ? "Mengirim..." : "Kirim Permintaan"}
            </button>
          </div>

          {myRequests.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-brand-navy">Riwayat Permintaan</h2>
              <div className="mt-4 space-y-3">
                {myRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-brand-navy">{req.role.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString("id-ID")}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      req.status === "approved" ? "bg-brand-teal/10 text-brand-teal" :
                      req.status === "rejected" ? "bg-red-100 text-red-600" :
                      req.status === "pending" ? "bg-brand-orange/10 text-brand-orange" :
                      "bg-gray-100 text-gray-600"
                    }`}>{req.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
