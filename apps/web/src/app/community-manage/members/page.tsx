"use client";

import { useState } from "react";
import {
  Users, Search, MoreVertical, Shield, UserCog,
  Trash2, Crown
} from "lucide-react";

const MOCK_MEMBERS = [
  { id: 1, name: "Budi Santoso", email: "budi@email.com", role: "admin", joinedDate: "12 Jan 2026", status: "active" },
  { id: 2, name: "Rina Sari", email: "rina@email.com", role: "moderator", joinedDate: "20 Feb 2026", status: "active" },
  { id: 3, name: "Dimas Prayoga", email: "dimas@email.com", role: "member", joinedDate: "05 Mar 2026", status: "active" },
  { id: 4, name: "Maya Putri", email: "maya@email.com", role: "member", joinedDate: "18 Mar 2026", status: "pending" },
  { id: 5, name: "Adi Wijaya", email: "adi@email.com", role: "member", joinedDate: "01 Apr 2026", status: "active" },
  { id: 6, name: "Sari Dewi", email: "sari@email.com", role: "moderator", joinedDate: "15 Apr 2026", status: "active" },
  { id: 7, name: "Fajar Nugroho", email: "fajar@email.com", role: "member", joinedDate: "22 May 2026", status: "pending" },
  { id: 8, name: "Lestari Rahayu", email: "lestari@email.com", role: "member", joinedDate: "10 Jun 2026", status: "active" },
];

const ROLES = ["all", "admin", "moderator", "member"];
const ROLE_LABELS: Record<string, string> = { all: "Semua Role", admin: "Admin", moderator: "Moderator", member: "Member" };

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Anggota Komunitas</h1>
        <p className="text-sm text-muted-foreground">Kelola anggota ID Tech Community</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari anggota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
        </div>
        <div className="flex gap-3">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                roleFilter === role
                  ? "bg-brand-blue text-white"
                  : "border border-border bg-white text-muted-foreground hover:bg-brand-light-gray"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-brand-light-gray">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal Gabung</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-brand-light-gray/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-brand-navy">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      member.role === "admin"
                        ? "bg-brand-orange/10 text-brand-orange"
                        : member.role === "moderator"
                          ? "bg-brand-blue/10 text-brand-blue"
                          : "bg-brand-light-gray text-muted-foreground"
                    }`}>
                      {member.role === "admin" && <Crown className="h-3 w-3" />}
                      {member.role === "moderator" && <Shield className="h-3 w-3" />}
                      {ROLE_LABELS[member.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{member.joinedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      member.status === "active"
                        ? "bg-brand-teal/10 text-brand-teal"
                        : "bg-brand-orange/10 text-brand-orange"
                    }`}>
                      {member.status === "active" ? "Aktif" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-brand-light-gray"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openMenu === member.id && (
                        <div className="absolute right-0 z-10 mt-1 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-light-gray">
                            <UserCog className="h-4 w-4 text-brand-blue" />
                            Ubah Role
                          </button>
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                            Hapus Anggota
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-2 text-sm">Tidak ada anggota ditemukan</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Menampilkan {filtered.length} dari {MOCK_MEMBERS.length} anggota</p>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-brand-light-gray">Sebelumnya</button>
          <button className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white">1</button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-brand-light-gray">Selanjutnya</button>
        </div>
      </div>
    </div>
  );
}
