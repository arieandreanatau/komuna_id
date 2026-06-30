import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  text?: string;
}

export function LoadingState({ className, text = "Memuat..." }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
