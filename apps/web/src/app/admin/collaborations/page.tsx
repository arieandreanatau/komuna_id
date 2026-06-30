"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

interface Collaboration {
  id: number;
  title: string;
  status: string;
  community: { name: string } | null;
  partner: { name: string } | null;
  created_at: string;
}

export default function AdminCollaborationsPage() {
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<Collaboration[]>("/admin/collaborations?per_page=50")
      .then((res) => setCollabs(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Manajemen Kolaborasi</h1>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-light-gray">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Judul</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Komunitas</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Mitra</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Status</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {collabs.map((collab) => (
              <tr key={collab.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{collab.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{collab.community?.name || "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{collab.partner?.name || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    collab.status === "active" ? "bg-brand-teal/10 text-brand-teal" :
                    collab.status === "pending" ? "bg-brand-orange/10 text-brand-orange" :
                    "bg-gray-100 text-gray-600"
                  }`}>{collab.status}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(collab.created_at).toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {collabs.length === 0 && <p className="p-8 text-center text-muted-foreground">Tidak ada data.</p>}
      </div>
    </div>
  );
}
