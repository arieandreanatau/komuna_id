"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchApi, getToken } from "@/lib/api";
import type { AuthUser } from "@/types/api";

interface UseAuthOptions {
  redirectTo?: string;
  required?: boolean;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { redirectTo = "/login", required = true } = options;
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      if (required) router.push(redirectTo);
      setLoading(false);
      return;
    }

    try {
      const res = await fetchApi<AuthUser>("/auth/me");
      setUser(res.data);
    } catch {
      if (required) router.push(redirectTo);
    } finally {
      setLoading(false);
    }
  }, [required, redirectTo, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refresh: fetchUser };
}
