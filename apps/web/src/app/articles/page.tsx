"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string;
  author: { name: string };
  category: { name: string } | null;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?per_page=12&page=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.data || []);
          setHasMore(data.meta ? data.meta.current_page < data.meta.last_page : false);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?per_page=12&page=${nextPage}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles((prev) => [...prev, ...(data.data || [])]);
          setPage(nextPage);
          setHasMore(data.meta ? data.meta.current_page < data.meta.last_page : false);
        }
      })
      .finally(() => setLoadingMore(false));
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Artikel & Berita
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Baca artikel terbaru dari komunitas KomunaID
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-12 text-center">
              <p className="text-muted-foreground">Belum ada artikel yang tersedia.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    {article.category && (
                      <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="mt-3 text-lg font-semibold text-brand-navy group-hover:text-brand-blue">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {article.excerpt || "Baca selengkapnya..."}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.author.name}</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-medium text-brand-navy hover:bg-muted disabled:opacity-50"
                  >
                    {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
