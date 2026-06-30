"use client";

import { useAuth } from "@/hooks/useAuth";
import { fetchApi } from "@/lib/api";
import { useState } from "react";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Password baru dan konfirmasi tidak cocok");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      await fetchApi("/auth/password", {
        method: "PUT",
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      setMessage("Password berhasil diubah");
      setMessageType("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessage(error.message || "Gagal mengubah password");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola pengaturan akun Anda</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Ubah Password</h2>
        <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy">Password Lama</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          {message && (
            <div className={`rounded-lg p-3 text-sm ${messageType === "success" ? "bg-brand-teal/10 text-brand-teal" : "bg-red-50 text-red-600"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Ubah Password"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Informasi Akun</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-brand-navy">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user?.status === "active" ? "bg-brand-teal/10 text-brand-teal" : "bg-red-50 text-red-600"}`}>
              {user?.status === "active" ? "Aktif" : user?.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email Verified</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user?.email_verified_at ? "bg-brand-teal/10 text-brand-teal" : "bg-yellow-50 text-yellow-600"}`}>
              {user?.email_verified_at ? "Terverifikasi" : "Belum Verifikasi"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm text-brand-navy">
              {user?.roles && user.roles.length > 0
                ? user.roles.map((r) => r.name).join(", ")
                : "Member"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-red-600">Zona Bahaya</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tindakan berikut tidak dapat dibatalkan.
        </p>
        <button className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
          Nonaktifkan Akun
        </button>
      </div>
    </div>
  );
}
