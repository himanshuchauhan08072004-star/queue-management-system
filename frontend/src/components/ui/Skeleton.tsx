import { cn } from "../../lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-700/50",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card flex items-center gap-4 p-5">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
    </div>
  );
}

export function TokenCardSkeleton() {
  return (
    <div className="glass-card flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-14 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
}
