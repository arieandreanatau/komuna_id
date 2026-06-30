import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  draft: "border-transparent bg-gray-100 text-gray-800",
  pending_review: "border-transparent bg-yellow-100 text-yellow-800",
  approved: "border-transparent bg-green-100 text-green-800",
  rejected: "border-transparent bg-red-100 text-red-800",
  archived: "border-transparent bg-gray-100 text-gray-600",
  temporarily_closed: "border-transparent bg-orange-100 text-orange-800",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf",
  pending_review: "Menunggu Review",
  approved: "Disetujui",
  rejected: "Ditolak",
  archived: "Diarsipkan",
  temporarily_closed: "Sementara Ditutup",
};

interface CommunityStatusBadgeProps {
  status: string;
  className?: string;
}

export function CommunityStatusBadge({ status, className }: CommunityStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status] || STATUS_STYLES.draft,
        className
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
