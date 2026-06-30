"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";

interface VolunteerOpportunity {
  id: number;
  title: string;
  description: string;
  location: string | null;
  is_online: boolean;
  start_date: string;
  end_date: string | null;
  max_volunteers: number | null;
  current_volunteers: number;
  status: string;
  skills_required: string | null;
  community: { id: number; name: string } | null;
  organizer: { id: number; name: string } | null;
}

export default function VolunteerPage() {
  const { loading: authLoading } = useAuth();
  const { data, loading, error } = useApi<{ data: VolunteerOpportunity[] }>(
    "/volunteer/opportunities"
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const opportunities = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Volunteer</h1>
        <p className="text-sm text-muted-foreground">
          Berpartisipasi dalam kegiatan volunteer
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {opportunities.length > 0 ? (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="rounded-xl border border-border bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-brand-navy">
                      {opp.title}
                    </h3>
                    <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-medium text-brand-orange">
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {opp.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {opp.community && (
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-brand-blue">
                          {opp.community.name}
                        </span>
                      </span>
                    )}
                    {opp.location && <span>{opp.location}</span>}
                    {opp.is_online && (
                      <span className="text-brand-teal">Online</span>
                    )}
                    <span>Mulai: {opp.start_date}</span>
                    {opp.max_volunteers && (
                      <span>
                        {opp.current_volunteers}/{opp.max_volunteers} volunteer
                      </span>
                    )}
                  </div>
                  {opp.skills_required && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Skills: {opp.skills_required}
                    </p>
                  )}
                </div>
                <button
                  disabled
                  className="ml-4 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                >
                  Lamar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-aqua/10">
            <svg
              className="h-8 w-8 text-brand-aqua"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-brand-navy">
            Belum Ada Lowongan
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Belum ada kesempatan volunteer yang tersedia saat ini.
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
