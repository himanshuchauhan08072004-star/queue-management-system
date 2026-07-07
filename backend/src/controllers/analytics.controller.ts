import { Request, Response } from "express";
import { prisma } from "../services/prisma";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** GET /analytics — all dashboard + chart data, computed dynamically. */
export async function getAnalytics(_req: Request, res: Response) {
  const today = startOfToday();

  const [
    totalQueues,
    activeQueues,
    waitingTokens,
    completedTokens,
    cancelledTokens,
    completedToday,
    cancelledToday,
    queues,
  ] = await Promise.all([
    prisma.queue.count(),
    prisma.queue.count({ where: { status: "ACTIVE" } }),
    prisma.token.count({ where: { status: "WAITING" } }),
    prisma.token.count({ where: { status: "COMPLETED" } }),
    prisma.token.count({ where: { status: "CANCELLED" } }),
    prisma.token.count({ where: { status: "COMPLETED", completedAt: { gte: today } } }),
    prisma.token.count({ where: { status: "CANCELLED", cancelledAt: { gte: today } } }),
    prisma.queue.findMany({
      include: { tokens: { where: { status: "WAITING" } } },
      orderBy: { name: "asc" },
    }),
  ]);

  // Average waiting time across all completed tokens (createdAt -> completedAt)
  const completed = await prisma.token.findMany({
    where: { status: "COMPLETED" },
    select: { createdAt: true, completedAt: true },
  });

  const avgWaitingMs =
    completed.length === 0
      ? 0
      : completed.reduce(
          (sum: number, t: { createdAt: Date; completedAt: Date | null }) =>
            sum + (t.completedAt!.getTime() - t.createdAt.getTime()),
          0
        ) / completed.length;

  const totalServedOrCancelled = completedTokens + cancelledTokens;
  const completionRate =
    totalServedOrCancelled === 0 ? 0 : Math.round((completedTokens / totalServedOrCancelled) * 100);

  // Queue length bar chart data
  const queueLengthChart = queues.map((q: { name: string; tokens: unknown[] }) => ({
    name: q.name,
    waiting: q.tokens.length,
  }));

  // Status distribution pie chart
  const statusPieChart = [
    { name: "Waiting", value: waitingTokens },
    { name: "Completed", value: completedTokens },
    { name: "Cancelled", value: cancelledTokens },
  ];

  // Served-per-hour line chart for today
  const todaysCompleted = await prisma.token.findMany({
    where: { status: "COMPLETED", completedAt: { gte: today } },
    select: { completedAt: true },
  });

  const hourlyBuckets = new Map<number, number>();
  for (const t of todaysCompleted) {
    const hour = t.completedAt!.getHours();
    hourlyBuckets.set(hour, (hourlyBuckets.get(hour) ?? 0) + 1);
  }
  const servedByHourChart = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${String(hour).padStart(2, "0")}:00`,
    served: hourlyBuckets.get(hour) ?? 0,
  }));

  // Peak queue time = the hour (today) with the most tokens created
  const todaysCreated = await prisma.token.findMany({
    where: { createdAt: { gte: today } },
    select: { createdAt: true },
  });
  const createdBuckets = new Map<number, number>();
  for (const t of todaysCreated) {
    const hour = t.createdAt.getHours();
    createdBuckets.set(hour, (createdBuckets.get(hour) ?? 0) + 1);
  }
  let peakHour: number | null = null;
  let peakCount = 0;
  for (const [hour, count] of createdBuckets.entries()) {
    if (count > peakCount) {
      peakCount = count;
      peakHour = hour;
    }
  }

  res.json({
    stats: {
      totalQueues,
      activeQueues,
      waitingTokens,
      completedTokens,
      cancelledTokens,
      avgWaitingMs,
      completedToday,
    },
    charts: {
      queueLength: queueLengthChart,
      statusDistribution: statusPieChart,
      servedByHour: servedByHourChart,
    },
    extra: {
      cancelledToday,
      completionRate,
      peakQueueHour: peakHour !== null ? `${String(peakHour).padStart(2, "0")}:00` : "N/A",
    },
  });
}
