"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchApi } from "@/lib/api";

interface UserProfile {
  id: number;
  username: string;
  full_name: string | null;
  name: string;
  email: string | null;
  phone_number: string | null;
  status: string;
  verification_level: number;
  email_verified_at: string | null;
  profile: {
    bio: string | null;
    avatar: string | null;
    phone: string | null;
    location: string | null;
    website: string | null;
  } | null;
}

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authUser) return;
    fetchApi<UserProfile>("/auth/me")
      .then((res) => {
        setUser(res.data);
        setFullName(res.data.full_name || "");
        setEmail(res.data.email || "");
        setPhoneNumber(res.data.phone_number || "");
        setBio(res.data.profile?.bio || "");
        setPhone(res.data.profile?.phone || "");
        setLocation(res.data.profile?.location || "");
        setWebsite(res.data.profile?.website || "");
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const body: Record<string, string> = { bio, phone, location, website };
      if (fullName) body.full_name = fullName;
      if (email) body.email = email;
      if (phoneNumber) body.phone_number = phoneNumber;

      await fetchApi("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setMessage("Profil berhasil diperbarui");
    } catch {
      setMessage("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const initials = (fullName || user?.username || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi profil Anda</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-navy text-2xl font-semibold text-white">
            {user?.profile?.avatar ? (
              <img src={user.profile.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="font-medium text-brand-navy">{user?.name}</p>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "Belum ada email"}</p>
            {!user?.email_verified_at && user?.email && (
              <p className="mt-1 text-xs text-brand-orange">
                Email belum diverifikasi —{" "}
                <button className="text-brand-blue hover:underline">Verifikasi sekarang</button>
              </p>
            )}
            <button className="mt-2 text-sm text-brand-blue hover:underline">
              Ubah Foto Profil
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-brand-navy">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="Nama lengkap kamu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy">Username</label>
            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="mt-1 block w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">Username tidak dapat diubah</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-brand-navy">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="email@contoh.com"
            />
            <p className="mt-1 text-xs text-muted-foreground">Opsional — bisa ditambahkan nanti</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy">Nomor WhatsApp</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            placeholder="Ceritakan tentang diri Anda..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-brand-navy">Telepon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="08xxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy">Lokasi</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="Jakarta, Indonesia"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            placeholder="https://..."
          />
        </div>

        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.includes("berhasil")
                ? "bg-brand-teal/10 text-brand-teal"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
