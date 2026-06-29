"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Category {
  id: number;
  name: string;
}

export default function CreateCommunityPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [joinMode, setJoinMode] = useState("open");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/communities/categories`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setCategories(data.data || []); })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/communities`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, category_id: categoryId, website, location, join_mode: joinMode }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/communities/${data.data.slug}`);
      } else {
        setError(data.message || Object.values(data.errors || {}).flat()[0] as string || "Gagal membuat komunitas");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <><Navbar /><div className="flex flex-1 items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div><Footer /></>;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray py-12">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-2xl font-semibold text-brand-navy">Buat Komunitas Baru</h1>
          <p className="mt-2 text-sm text-muted-foreground">Isi formulir berikut untuk mengajukan komunitas baru</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-border bg-white p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-navy">Nama Komunitas *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Nama komunitas Anda" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Deskripsi *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Ceritakan tentang komunitas Anda..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Kategori *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm">
                <option value="">Pilih kategori...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-brand-navy">Website</label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy">Lokasi</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm" placeholder="Jakarta, Indonesia" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy">Mode Keanggotaan</label>
              <select value={joinMode} onChange={(e) => setJoinMode(e.target.value)} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm">
                <option value="open">Terbuka - Siapapun bisa langsung bergabung</option>
                <option value="approval_required">Butuh Persetujuan - Perlu disetujui admin</option>
                <option value="invite_only">Undangan Saja - Hanya by undangan</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50">
              {submitting ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
