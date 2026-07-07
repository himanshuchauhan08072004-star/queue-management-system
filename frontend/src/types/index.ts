export type QueueStatus = "ACTIVE" | "INACTIVE";
export type TokenStatus = "WAITING" | "SERVING" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Queue {
  id: string;
  name: string;
  status: QueueStatus;
  createdAt: string;
  waitingCount: number;
}

export interface Token {
  id: string;
  queueId: string;
  tokenNumber: string;
  customerName: string;
  mobile?: string | null;
  notes?: string | null;
  status: TokenStatus;
  position: number;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  waitingMs: number;
}

export interface AnalyticsStats {
  totalQueues: number;
  activeQueues: number;
  waitingTokens: number;
  completedTokens: number;
  cancelledTokens: number;
  avgWaitingMs: number;
  completedToday: number;
}

export interface AnalyticsCharts {
  queueLength: { name: string; waiting: number }[];
  statusDistribution: { name: string; value: number }[];
  servedByHour: { hour: string; served: number }[];
}

export interface AnalyticsExtra {
  cancelledToday: number;
  completionRate: number;
  peakQueueHour: string;
}

export interface Analytics {
  stats: AnalyticsStats;
  charts: AnalyticsCharts;
  extra: AnalyticsExtra;
}

export interface ApiErrorResponse {
  message: string;
  errors?: { field: string; message: string }[];
}
