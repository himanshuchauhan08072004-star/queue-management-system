import { cn } from "../../lib/utils";
import { TokenStatus, QueueStatus } from "../../types";

const statusStyles: Record<string, string> = {
  WAITING: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  SERVING: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  INACTIVE: "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400",
};

export default function Badge({ status }: { status: TokenStatus | QueueStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusStyles[status]
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
