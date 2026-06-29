"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Community {
  id: number;
  name: string;
  status: string;
  owner: { name: string };
  created_at: string;
}

export default function AdminCommunitiesPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending_review");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/communities?status=${filter}&per_page=50`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { if (data.success) setCommunities(data.data || []); })
      .finally(() => setLoading(false));
  }, [router, filter]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-navy">Manajemen Komunitas</h1>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setLoading(true); }} className="rounded-lg border border-border px-4 py-2 text-sm">
          <option value="pending_review">Menunggu Review</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-light-gray">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Nama</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Pemilik</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Status</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {communities.map((c) => (
              <tr key={c.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.owner?.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    c.status === "approved" ? "bg-brand-teal/10 text-brand-teal" :
                    c.status === "pending_review" ? "bg-brand-orange/10 text-brand-orange" :
                    c.status === "rejected" ? "bg-red-100 text-red-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>{c.status}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {c.status === "pending_review" && (
                    <>
                      <button className="rounded bg-brand-teal px-3 py-1 text-xs font-medium text-white hover:bg-brand-teal/90">Setujui</button>
                      <button className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {communities.length === 0 && <p className="p-8 text-center text-muted-foreground">Tidak ada data.</p>}
      </div>
    </div>
  );
}
