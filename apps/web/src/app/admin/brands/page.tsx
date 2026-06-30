"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface Brand {
  id: number;
  name: string;
  slug: string;
  status: string;
  owner: { name: string };
  created_at: string;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending_review");

  const loadBrands = () => {
    setLoading(true);
    fetchApi<Brand[]>(`/admin/brands?status=${filter}&per_page=50`)
      .then((res) => setBrands(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBrands();
  }, [filter]);

  const handleApprove = async (id: number) => {
    try {
      await fetchApi(`/admin/brands/${id}/approve`, { method: "POST" });
      toast.success("Brand disetujui");
      loadBrands();
    } catch {
      toast.error("Gagal menyetujui brand");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetchApi(`/admin/brands/${id}/reject`, { method: "POST" });
      toast.success("Brand ditolak");
      loadBrands();
    } catch {
      toast.error("Gagal menolak brand");
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-navy">Manajemen Brand</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-border px-4 py-2 text-sm">
          <option value="pending_review">Menunggu Review</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
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
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{brand.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{brand.owner?.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    brand.status === "approved" ? "bg-brand-teal/10 text-brand-teal" :
                    brand.status === "pending_review" ? "bg-brand-orange/10 text-brand-orange" :
                    "bg-red-100 text-red-600"
                  }`}>{brand.status}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {brand.status === "pending_review" && (
                    <>
                      <button onClick={() => handleApprove(brand.id)} className="rounded bg-brand-teal px-3 py-1 text-xs font-medium text-white hover:bg-brand-teal/90">Setujui</button>
                      <button onClick={() => handleReject(brand.id)} className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {brands.length === 0 && <p className="p-8 text-center text-muted-foreground">Tidak ada data.</p>}
      </div>
    </div>
  );
}
