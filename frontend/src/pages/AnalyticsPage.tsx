import { Timer, ListChecks, XCircle, TrendingUp, Clock3 } from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import StatCard from "../components/ui/StatCard";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import WaitTimeBarChart from "../components/charts/WaitTimeBarChart";
import StatusPieChart from "../components/charts/StatusPieChart";
import ServedLineChart from "../components/charts/ServedLineChart";
import { formatDuration } from "../lib/utils";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Live performance metrics across all queues.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading || !data ? (
          [...Array(5)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Avg. Waiting Time"
              value={formatDuration(data.stats.avgWaitingMs)}
              icon={Timer}
              accent="violet"
            />
            <StatCard label="Queue Length" value={data.stats.waitingTokens} icon={ListChecks} accent="amber" delay={0.03} />
            <StatCard label="Served Today" value={data.stats.completedToday} icon={TrendingUp} accent="emerald" delay={0.06} />
            <StatCard label="Cancelled Today" value={data.extra.cancelledToday} icon={XCircle} accent="rose" delay={0.09} />
            <StatCard label="Peak Queue Time" value={data.extra.peakQueueHour} icon={Clock3} accent="sky" delay={0.12} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
            Queue length by queue
          </h2>
          {data && <WaitTimeBarChart data={data.charts.queueLength} />}
        </div>

        <div className="glass-card p-5">
          <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
            Token status distribution
          </h2>
          {data && <StatusPieChart data={data.charts.statusDistribution} />}
        </div>

        <div className="glass-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Customers served today (by hour)
            </h2>
            <span className="text-sm font-semibold text-brand-600">
              Completion rate: {data?.extra.completionRate ?? 0}%
            </span>
          </div>
          {data && <ServedLineChart data={data.charts.servedByHour} />}
        </div>
      </div>
    </div>
  );
}
