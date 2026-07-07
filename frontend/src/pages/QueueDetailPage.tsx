import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Download } from "lucide-react";
import { useQueues } from "../hooks/useQueues";
import { useTokens } from "../hooks/useTokens";
import TokenList from "../components/token/TokenList";
import AddTokenModal from "../components/token/AddTokenModal";
import Badge from "../components/ui/Badge";
import { formatDateTime, formatDuration } from "../lib/utils";

type HistoryTab = "COMPLETED" | "CANCELLED";

export default function QueueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: queues } = useQueues();
  const { data: tokens, isLoading } = useTokens(id);
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState<HistoryTab>("COMPLETED");

  const queue = queues?.find((q) => q.id === id);

  const historyTokens = useMemo(() => {
    if (!tokens) return [];
    return tokens
      .filter((t) => t.status === tab)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tokens, tab]);

  function exportCsv() {
    if (!tokens || tokens.length === 0) return;
    const header = [
      "Token Number",
      "Customer Name",
      "Mobile",
      "Status",
      "Created At",
      "Completed At",
      "Waiting Duration",
    ];
    const rows = tokens.map((t) => [
      t.tokenNumber,
      t.customerName,
      t.mobile ?? "",
      t.status,
      new Date(t.createdAt).toISOString(),
      t.completedAt ? new Date(t.completedAt).toISOString() : "",
      formatDuration(t.waitingMs),
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${queue?.name ?? "queue"}-export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!queue) {
    return (
      <div className="glass-card p-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Queue not found.{" "}
        <button className="font-semibold text-brand-600" onClick={() => navigate("/queues")}>
          Back to queues
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/queues")}
            className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
          >
            <ArrowLeft size={15} /> Back to queues
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{queue.name}</h1>
            <Badge status={queue.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="btn-secondary">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={17} /> Add customer
          </button>
        </div>
      </div>

      <TokenList
        queueId={queue.id}
        tokens={tokens ?? []}
        isLoading={isLoading}
        onAddTokenClick={() => setAddOpen(true)}
      />

      <div className="glass-card p-5">
        <div className="mb-4 flex items-center gap-2">
          {(["COMPLETED", "CANCELLED"] as HistoryTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
                tab === t
                  ? "bg-brand-600 text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t === "COMPLETED" ? "Served history" : "Cancelled history"}
            </button>
          ))}
        </div>

        {historyTokens.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
                  <th className="py-2 pr-4">Token</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2 pr-4">{tab === "COMPLETED" ? "Completed" : "Cancelled"}</th>
                  <th className="py-2 pr-4">Waiting time</th>
                </tr>
              </thead>
              <tbody>
                {historyTokens.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">
                      {t.tokenNumber}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{t.customerName}</td>
                    <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                      {formatDateTime(t.createdAt)}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                      {t.completedAt
                        ? formatDateTime(t.completedAt)
                        : t.cancelledAt
                        ? formatDateTime(t.cancelledAt)
                        : "—"}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                      {formatDuration(t.waitingMs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTokenModal open={addOpen} onClose={() => setAddOpen(false)} queueId={queue.id} />
    </div>
  );
}
