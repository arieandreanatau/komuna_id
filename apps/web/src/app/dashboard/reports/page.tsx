"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import type {
  Report
} from "@/types/api";

export default function ReportsPage() {
  const { loading: authLoading } = useAuth();
  const { data, loading, error } = useApi<{ data: Report[] }>("/member/reports");

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const reports = data?.data || [];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-600",
    reviewed: "bg-brand-blue/10 text-brand-blue",
    resolved: "bg-brand-teal/10 text-brand-teal",
    dismissed: "bg-red-50 text-red-600",
  };

  const statusLabels: Record<string, string> = {
    pending: "Menunggu Review",
    reviewed: "Sedang Direview",
    resolved: "Selesai",
    dismissed: "Ditolak",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Laporan Saya</h1>
        <p className="text-sm text-muted-foreground">Riwayat laporan yang Anda kirim</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-medium text-brand-navy">
                      {report.reportable_type}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[report.status] || "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[report.status] || report.status}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-brand-navy">{report.reason}</p>
                  {report.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="mt-4 text-muted-foreground">Belum ada laporan.</p>
        </div>
      )}
    </div>
  );
}
