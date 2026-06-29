"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Community {
  id: number;
  name: string;
  slug: string;
  description: string;
  member_count: number;
  category: { name: string; slug: string } | null;
  owner: { name: string };
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/communities?per_page=12`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCommunities(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Jelajahi Komunitas
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Temukan komunitas yang sesuai minat Anda
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari komunitas..."
                className="w-full rounded-lg border-0 px-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-aqua"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-12 text-center">
              <p className="text-muted-foreground">
                {search ? "Tidak ada komunitas yang cocok dengan pencarian Anda." : "Belum ada komunitas yang tersedia."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((community) => (
                <Link
                  key={community.id}
                  href={`/communities/${community.slug}`}
                  className="group rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-sm font-bold text-brand-teal">
                      {community.name.charAt(0)}
                    </div>
                    {community.category && (
                      <span className="rounded-full bg-brand-light-gray px-3 py-1 text-xs font-medium text-muted-foreground">
                        {community.category.name}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-brand-navy group-hover:text-brand-blue">
                    {community.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {community.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{community.member_count} anggota</span>
                    <span>Oleh {community.owner.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
