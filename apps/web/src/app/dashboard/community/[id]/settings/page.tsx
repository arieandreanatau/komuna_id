"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Settings, Globe, Lock, UserPlus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { CommunitySettings } from "@/types/api";
import { LoadingState } from "@/components/community/LoadingState";

export default function CommunitySettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [settings, setSettings] = useState<CommunitySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchApi<CommunitySettings>(`/communities/${id}/settings`)
      .then((res) => setSettings(res.data))
      .catch((err) => setError(err.message || "Gagal memuat pengaturan"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSuccess(false);
    try {
      await fetchApi(`/communities/${id}/settings`, {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : null) || "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Pengaturan Komunitas</h1>
        <p className="text-sm text-muted-foreground">Konfigurasi pengaturan komunitas Anda</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-brand-navy flex items-center gap-2">
            <Lock className="h-5 w-5 text-brand-blue" />
            Pengaturan Privasi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur siapa yang bisa melihat dan bergabung ke komunitas
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-brand-blue" />
              <div>
                <p className="font-medium text-brand-navy">Komunitas Publik</p>
                <p className="text-sm text-muted-foreground">
                  Komunitas dapat ditemukan oleh semua pengguna
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setSettings((prev) =>
                  prev
                    ? { ...prev, privacy: { ...prev.privacy, is_public: !prev.privacy.is_public } }
                    : prev
                )
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.privacy.is_public ? "bg-brand-blue" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings.privacy.is_public ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-brand-blue" />
              <div>
                <p className="font-medium text-brand-navy">Mode Bergabung</p>
                <p className="text-sm text-muted-foreground">
                  Tentukan bagaimana anggota baru bergabung
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { value: "open", label: "Terbuka", desc: "Siapa saja bisa langsung bergabung" },
                { value: "approval_required", label: "Perlu Persetujuan", desc: "Menunggu persetujuan admin" },
                { value: "invite_only", label: "Undangan Saja", desc: "Hanya bisa bergabung via undangan" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() =>
                    setSettings((prev) =>
                      prev
                        ? { ...prev, privacy: { ...prev.privacy, join_mode: mode.value } }
                        : prev
                    )
                  }
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    settings.privacy.join_mode === mode.value
                      ? "border-brand-blue bg-brand-blue/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    settings.privacy.join_mode === mode.value ? "text-brand-blue" : "text-brand-navy"
                  }`}>
                    {mode.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90 disabled:opacity-50"
        >
          <Settings className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
        {success && (
          <span className="text-sm font-medium text-green-600">Pengaturan tersimpan!</span>
        )}
      </div>
    </div>
  );
}
