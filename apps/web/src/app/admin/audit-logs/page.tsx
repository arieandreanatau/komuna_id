"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

interface AuditLog {
  id: number;
  action: string;
  auditable_type: string;
  auditable_id: number;
  user: { name: string } | null;
  ip_address: string;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<AuditLog[]>("/admin/audit-logs?per_page=50")
      .then((res) => setLogs(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Audit Logs</h1>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-light-gray">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Waktu</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">User</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Aksi</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">Target</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 text-muted-foreground">{new Date(log.created_at).toLocaleString("id-ID")}</td>
                <td className="px-4 py-3 font-medium text-brand-navy">{log.user?.name || "System"}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-brand-blue/10 px-2 py-1 text-xs font-medium text-brand-blue">{log.action}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{log.auditable_type.split("\\").pop()}#{log.auditable_id}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.ip_address || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="p-8 text-center text-muted-foreground">Belum ada audit log.</p>}
      </div>
    </div>
  );
}
