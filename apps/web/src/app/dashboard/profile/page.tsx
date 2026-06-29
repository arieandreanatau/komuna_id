"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  status: string;
  profile: {
    bio: string | null;
    phone: string | null;
    location: string | null;
    website: string | null;
  } | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          setName(data.data.name);
          setBio(data.data.profile?.bio || "");
          setPhone(data.data.profile?.phone || "");
          setLocation(data.data.profile?.location || "");
          setWebsite(data.data.profile?.website || "");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, bio, phone, location, website }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Profil berhasil diperbarui");
      } else {
        setMessage(data.message || "Gagal memperbarui profil");
      }
    } catch {
      setMessage("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi profil Anda
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-navy">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="mt-1 block w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy">
            Bio
          </label>
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
            <label className="block text-sm font-medium text-brand-navy">
              Telepon
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="08xxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy">
              Lokasi
            </label>
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
          <label className="block text-sm font-medium text-brand-navy">
            Website
          </label>
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
