import {
  ListOrdered,
  PlayCircle,
  Users,
  CheckCircle2,
  XCircle,
  Timer,
  CalendarCheck2,
} from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import StatCard from "../components/ui/StatCard";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { formatDuration } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { data, isLoading } = useAnalytics();
  const { user } = useAuth();
  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0] ?? "Manager"} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening across your queues today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !stats ? (
          [...Array(7)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Queues" value={stats.totalQueues} icon={ListOrdered} accent="brand" delay={0} />
            <StatCard label="Active Queues" value={stats.activeQueues} icon={PlayCircle} accent="sky" delay={0.03} />
            <StatCard label="Waiting Tokens" value={stats.waitingTokens} icon={Users} accent="amber" delay={0.06} />
            <StatCard label="Completed Tokens" value={stats.completedTokens} icon={CheckCircle2} accent="emerald" delay={0.09} />
            <StatCard label="Cancelled Tokens" value={stats.cancelledTokens} icon={XCircle} accent="rose" delay={0.12} />
            <StatCard
              label="Avg. Waiting Time"
              value={formatDuration(stats.avgWaitingMs)}
              icon={Timer}
              accent="violet"
              delay={0.15}
            />
            <StatCard
              label="Served Today"
              value={stats.completedToday}
              icon={CalendarCheck2}
              accent="brand"
              delay={0.18}
            />
          </>
        )}
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">Quick tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• Go to <span className="font-semibold">Queues</span> to create a queue and start adding customers.</li>
          <li>• Use <span className="font-semibold">Serve Next</span> to complete the first waiting token automatically.</li>
          <li>• Check <span className="font-semibold">Analytics</span> for charts on queue performance over time.</li>
        </ul>
      </div>
    </div>
  );
}
