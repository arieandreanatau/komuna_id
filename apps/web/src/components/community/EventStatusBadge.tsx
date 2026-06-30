import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  draft: "border-transparent bg-gray-100 text-gray-800",
  published: "border-transparent bg-green-100 text-green-800",
  cancelled: "border-transparent bg-red-100 text-red-800",
  archived: "border-transparent bg-gray-100 text-gray-600",
  completed: "border-transparent bg-blue-100 text-blue-800",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf",
  published: "Diterbitkan",
  cancelled: "Dibatalkan",
  archived: "Diarsipkan",
  completed: "Selesai",
};

interface EventStatusBadgeProps {
  status: string;
  className?: string;
}

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
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
