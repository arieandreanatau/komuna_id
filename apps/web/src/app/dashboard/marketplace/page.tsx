"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  category: string | null;
  stock: number;
  image: string | null;
  seller: { id: number; name: string } | null;
  community: { id: number; name: string } | null;
}

export default function MarketplacePage() {
  const { loading: authLoading } = useAuth();
  const { data, loading, error } = useApi<{ data: Product[] }>(
    "/products"
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Jelajahi produk dari komunitas
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-border bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-brand-navy">
                      {product.name}
                    </h3>
                    <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-medium text-brand-orange">
                      Coming Soon
                    </span>
                  </div>
                  {product.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-brand-teal">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </span>
                    {product.category && (
                      <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-brand-blue">
                        {product.category}
                      </span>
                    )}
                    <span>Stok: {product.stock}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {product.seller && (
                      <span>Oleh: {product.seller.name}</span>
                    )}
                    {product.community && (
                      <span> | {product.community.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
            <svg
              className="h-8 w-8 text-brand-orange"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-brand-navy">
            Belum Ada Produk
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Marketplace sedang dalam pengembangan. Segera hadir untuk
            menjelajahi dan membeli produk dari komunitas.
          </p>
          <div className="mt-4">
            <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
              Coming Soon
            </span>
          </div>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-brand-navy hover:bg-muted"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
