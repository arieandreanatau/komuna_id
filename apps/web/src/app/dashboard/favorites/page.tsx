"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import type { Favorite } from "@/types/api";

export default function FavoritesPage() {
  const {_user, loading: authLoading} = useAuth();
  const { data, loading, error, execute } = useApi<{ data: Favorite[] }>("/member/favorites");

  const removeFavorite = async (id: number) => {
    try {
      await fetchApi(`/member/favorites/${id}`, { method: "DELETE" });
      execute();
    } catch {}
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const favorites = data?.data || [];

  const typeLabels: Record<string, string> = {
    community: "Komunitas",
    event: "Event",
    article: "Artikel",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Favorit</h1>
        <p className="text-sm text-muted-foreground">Item yang Anda simpan</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {favorites.length > 0 ? (
        <div className="space-y-3">
          {favorites.map((fav) => (
            <div key={fav.id} className="flex items-center justify-between rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
                  {typeLabels[fav.favorable_type] || fav.favorable_type}
                </span>
                <span className="text-sm text-muted-foreground">
                  ID: {fav.favorable_id}
                </span>
              </div>
              <button
                onClick={() => removeFavorite(fav.id)}
                className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <p className="mt-4 text-muted-foreground">Belum ada favorit.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/communities" className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90">
              Jelajahi Komunitas
            </Link>
            <Link href="/events" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-brand-navy hover:bg-muted">
              Jelajahi Event
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
