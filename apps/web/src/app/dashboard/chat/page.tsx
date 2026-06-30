"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";

interface ChatThread {
  id: number;
  type: string;
  name: string | null;
  community: { id: number; name: string } | null;
  created_at: string;
}

export default function ChatPage() {
  const { loading: authLoading } = useAuth();
  const { data, loading, error } = useApi<{ data: ChatThread[] }>(
    "/me/chat/threads"
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const threads = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Chat</h1>
        <p className="text-sm text-muted-foreground">
          Diskusi dengan anggota komunitas
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="flex items-center justify-between rounded-xl border border-border bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal/10">
                  <svg
                    className="h-5 w-5 text-brand-teal"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-brand-navy">
                      {thread.name || thread.community?.name || "Thread"}
                    </p>
                    <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-medium text-brand-orange">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {thread.type} &middot;{" "}
                    {new Date(thread.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <button
                disabled
                className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground opacity-50 cursor-not-allowed"
              >
                Buka
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/10">
            <svg
              className="h-8 w-8 text-brand-teal"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-brand-navy">
            Belum Ada Thread
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chat dan diskusi komunitas sedang dalam pengembangan. Bergabung
            dengan komunitas untuk mulai berdiskusi.
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
