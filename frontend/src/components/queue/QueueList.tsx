import { motion } from "framer-motion";
import { Users, Trash2, Power } from "lucide-react";
import { Queue } from "../../types";
import Badge from "../ui/Badge";
import { formatDateTime } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface QueueListProps {
  queues: Queue[];
  selectedQueueId: string | null;
  onSelect: (id: string) => void;
  onToggleStatus: (queue: Queue) => void;
  onDelete: (queue: Queue) => void;
}

export default function QueueList({
  queues,
  selectedQueueId,
  onSelect,
  onToggleStatus,
  onDelete,
}: QueueListProps) {
  return (
    <div className="space-y-3">
      {queues.map((queue, i) => (
        <motion.div
          key={queue.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.03 }}
          onClick={() => onSelect(queue.id)}
          className={cn(
            "glass-card cursor-pointer p-4 transition-all hover:shadow-lg",
            selectedQueueId === queue.id && "ring-2 ring-brand-500"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                  {queue.name}
                </h3>
                <Badge status={queue.status} />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Created {formatDateTime(queue.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(queue);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
                title={queue.status === "ACTIVE" ? "Set inactive" : "Set active"}
              >
                <Power size={15} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(queue);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                title="Delete queue"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
            <Users size={14} />
            <span className="font-medium">{queue.waitingCount}</span> waiting
          </div>
        </motion.div>
      ))}
    </div>
  );
}
