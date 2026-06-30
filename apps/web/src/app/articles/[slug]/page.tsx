"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { sanitizeHtml } from "@/lib/sanitize";

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published_at: string;
  author: { name: string };
  category: { name: string } | null;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setArticle(data.data);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-muted-foreground">Artikel tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <article className="mx-auto max-w-3xl px-4 py-12">
          {article.category && (
            <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
              {article.category.name}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-semibold text-brand-navy">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Oleh {article.author.name}</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          <div className="mt-8 prose prose-sm max-w-none text-foreground">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
