"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchApi, getToken } from "@/lib/api";

interface Community {
  id: number;
  name: string;
  slug: string;
  description: string;
  member_count: number;
  location: string | null;
  website: string | null;
  join_mode: string;
  category: { name: string } | null;
  owner: { name: string; email: string };
}

export default function CommunityDetailPage() {
  const params = useParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/communities/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCommunity(data.data);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    const token = getToken();
    if (!token || !community) return;
    fetchApi<{ data: Array<{ community_id: number }> }>(`/me/communities`)
      .then((res) => {
        const memberships = res.data?.data || [];
        setIsMember(memberships.some((m) => m.community_id === community.id));
      })
      .catch(() => {});
  }, [community]);

  const handleJoin = async () => {
    if (!community) return;
    setJoining(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Silakan login terlebih dahulu");
        setMessageType("error");
        return;
      }

      await fetchApi(`/communities/${community.id}/join`, {
        method: "POST",
      });

      if (community.join_mode === "approval_required") {
        setMessage("Permintaan join terkirim. Menunggu persetujuan.");
        setMessageType("success");
      } else {
        setMessage("Berhasil bergabung!");
        setMessageType("success");
        setIsMember(true);
        setCommunity({ ...community, member_count: community.member_count + 1 });
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessage(error.message || "Gagal bergabung");
      setMessageType("error");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!community) return;
    setJoining(true);
    setMessage("");

    try {
      await fetchApi(`/communities/${community.id}/leave`, { method: "POST" });
      setMessage("Berhasil keluar dari komunitas");
      setMessageType("success");
      setIsMember(false);
      setCommunity({ ...community, member_count: community.member_count - 1 });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessage(error.message || "Gagal keluar");
      setMessageType("error");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
        </div>
        <Footer />
      </>
    );
  }

  if (!community) {
    return (
      <>
        <Navbar />
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-muted-foreground">Komunitas tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <div className="bg-gradient-to-r from-brand-navy to-brand-teal py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-brand-teal">
              {community.name.charAt(0)}
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-white">
              {community.name}
            </h1>
            {community.category && (
              <span className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm text-white">
                {community.category.name}
              </span>
            )}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-white/80">
              <span>{community.member_count} anggota</span>
              {community.location && <span>{community.location}</span>}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-white p-6">
                <h2 className="text-lg font-semibold text-brand-navy">Tentang Komunitas</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {community.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-white p-6">
                {message && (
                  <div className={`mb-3 rounded-lg p-3 text-sm ${messageType === "success" ? "bg-brand-teal/10 text-brand-teal" : "bg-red-50 text-red-600"}`}>
                    {message}
                  </div>
                )}

                {isMember ? (
                  <button
                    onClick={handleLeave}
                    disabled={joining}
                    className="w-full rounded-lg border border-red-300 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {joining ? "Memproses..." : "Keluar dari Komunitas"}
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={joining || community.join_mode === "invite_only"}
                    className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
                  >
                    {joining ? "Memproses..." : community.join_mode === "open" ? "Gabung Sekarang" : community.join_mode === "approval_required" ? "Ajukan Keanggotaan" : "Invite Only"}
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="text-sm font-semibold text-brand-navy">Informasi</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pemilik</dt>
                    <dd className="font-medium text-brand-navy">{community.owner.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Mode Join</dt>
                    <dd className="font-medium text-brand-navy capitalize">
                      {community.join_mode === "open" ? "Terbuka" : community.join_mode === "approval_required" ? "Butuh Persetujuan" : "Invite Only"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
