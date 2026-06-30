"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";

interface WalletBalance {
  balance: string;
  currency: string;
}

interface WalletTransaction {
  id: number;
  amount: string;
  type: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function WalletPage() {
  const { loading: authLoading } = useAuth();
  const {
    data: balanceData,
    loading: balanceLoading,
    error: balanceError,
  } = useApi<WalletBalance>("/me/wallet");
  const {
    data: txData,
    loading: txLoading,
    error: txError,
  } = useApi<{ data: WalletTransaction[] }>("/me/wallet/transactions");

  if (authLoading || balanceLoading || txLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const transactions = txData?.data || [];
  const balance = balanceData?.balance || "0";
  const currency = balanceData?.currency || "IDR";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Dompet</h1>
        <p className="text-sm text-muted-foreground">
          Kelola saldo dan transaksi Anda
        </p>
      </div>

      {(balanceError || txError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {balanceError || txError}
        </div>
      )}

      <div className="rounded-xl border border-border bg-gradient-to-br from-brand-navy to-brand-blue p-6 text-white">
        <p className="text-sm opacity-80">Saldo Anda</p>
        <p className="mt-1 text-3xl font-bold">
          {currency} {Number(balance).toLocaleString("id-ID")}
        </p>
        <div className="mt-3">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
            Coming Soon
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-brand-navy">
          Riwayat Transaksi
        </h2>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-xl border border-border bg-white p-4"
            >
              <div>
                <p className="text-sm font-medium text-brand-navy">
                  {tx.description || tx.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
              <span
                className={
                  tx.type === "credit"
                    ? "text-sm font-semibold text-green-600"
                    : "text-sm font-semibold text-red-600"
                }
              >
                {tx.type === "credit" ? "+" : "-"} {currency}{" "}
                {Number(tx.amount).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
            />
          </svg>
          <p className="mt-4 text-muted-foreground">
            Belum ada transaksi.
          </p>
        </div>
      )}

      <Link
        href="/dashboard"
        className="inline-flex rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-brand-navy hover:bg-muted"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
