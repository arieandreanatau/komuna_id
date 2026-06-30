"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

interface Article {
  id: number;
  title: string;
  slug: string;
  status: string;
  author: { name: string };
  category: { name: string } | null;
  published_at: string | null;
  created_at: string;
}

export default function AdminCmsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<Article[]>("/admin/articles?per_page=50")
      .then((res) => setArticles(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Manajemen Artikel (CMS)</h1>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-light-gray">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Judul</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Penulis</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Kategori</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Status</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{article.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{article.author?.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{article.category?.name || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    article.status === "published" ? "bg-brand-teal/10 text-brand-teal" :
                    article.status === "draft" ? "bg-gray-100 text-gray-600" :
                    "bg-brand-orange/10 text-brand-orange"
                  }`}>{article.status}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("id-ID")
                    : new Date(article.created_at).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && <p className="p-8 text-center text-muted-foreground">Tidak ada data.</p>}
      </div>
    </div>
  );
}
