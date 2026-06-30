"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CommunityMember } from "@/types/api";

export default function MyCommunitiesPage() {
  const {_user, loading: authLoading} = useAuth();
  const router = useRouter();
  const { data, loading, error } = useApi<{ data: CommunityMember[] }>("/me/communities");

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Komunitas Saya</h1>
          <p className="text-sm text-muted-foreground">Daftar komunitas yang Anda ikuti</p>
        </div>
        <button
          onClick={() => router.push("/communities")}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90"
        >
          Jelajahi Komunitas
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((member) => (
            <Link
              key={member.id}
              href={`/communities/${member.community.slug}`}
              className="rounded-xl border border-border bg-white p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-semibold text-brand-blue">
                  {member.community.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brand-navy truncate">{member.community.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.community.category?.name || "Umum"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bergabung {new Date(member.joined_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          <p className="mt-4 text-muted-foreground">Anda belum bergabung dengan komunitas manapun.</p>
          <Link href="/communities" className="mt-4 inline-flex rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90">
            Jelajahi Komunitas
          </Link>
        </div>
      )}
    </div>
  );
}
