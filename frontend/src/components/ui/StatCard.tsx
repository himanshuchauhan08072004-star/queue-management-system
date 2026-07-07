import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "brand" | "emerald" | "amber" | "rose" | "sky" | "violet";
  delay?: number;
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  brand: "from-brand-500 to-brand-700 shadow-brand-500/25",
  emerald: "from-emerald-400 to-emerald-600 shadow-emerald-500/25",
  amber: "from-amber-400 to-amber-600 shadow-amber-500/25",
  rose: "from-rose-400 to-rose-600 shadow-rose-500/25",
  sky: "from-sky-400 to-sky-600 shadow-sky-500/25",
  violet: "from-violet-400 to-violet-600 shadow-violet-500/25",
};

export default function StatCard({ label, value, icon: Icon, accent = "brand", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-card flex items-center gap-4 p-5"
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
          accentStyles[accent]
        )}
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}
