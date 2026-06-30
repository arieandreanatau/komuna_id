import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<string, string> = {
  "community-owner": "border-transparent bg-green-100 text-green-800",
  "community-admin": "border-transparent bg-blue-100 text-blue-800",
  "event-manager": "border-transparent bg-purple-100 text-purple-800",
  "volunteer-coordinator": "border-transparent bg-orange-100 text-orange-800",
  "member": "border-transparent bg-gray-100 text-gray-800",
};

const ROLE_LABELS: Record<string, string> = {
  "community-owner": "Owner Komunitas",
  "community-admin": "Community Admin",
  "event-manager": "Event Manager",
  "volunteer-coordinator": "Volunteer Coordinator",
  "member": "Anggota",
};

interface CommunityRoleBadgeProps {
  role: string;
  className?: string;
}

export function CommunityRoleBadge({ role, className }: CommunityRoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        ROLE_STYLES[role] || ROLE_STYLES["member"],
        className
      )}
    >
      {ROLE_LABELS[role] || role}
    </span>
  );
}
