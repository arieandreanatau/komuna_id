"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import type { AuthUser } from "@/types/api";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchApi<AuthUser>("/auth/me")
      .then((res) => {
        const user = res.data;
        if (requireAdmin) {
          const adminSlugs = ["super-admin", "admin", "platform-admin"];
          const hasAdminRole = user.roles?.some((r) => adminSlugs.includes(r.slug));
          if (!hasAdminRole) {
            router.push("/dashboard");
            return;
          }
        }
        setAuthorized(true);
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [requireAdmin, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-light-gray">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
