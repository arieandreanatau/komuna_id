import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CommunityEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: CommunityEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center",
        className
      )}
    >
      <div className="mb-4 text-muted-foreground/40">
        {icon || <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
