import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, X, Phone, StickyNote } from "lucide-react";
import { Token } from "../../types";
import Badge from "../ui/Badge";
import { formatDuration } from "../../lib/utils";

interface TokenCardProps {
  token: Token;
  position: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCancel: () => void;
}

export default function TokenCard({
  token,
  position,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onCancel,
}: TokenCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className="glass-card flex items-center justify-between gap-4 p-4"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
          <span className="text-sm font-bold leading-none">{token.tokenNumber}</span>
          <span className="mt-0.5 text-[10px] font-medium opacity-80">#{position}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-white">
            {token.customerName}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Waiting {formatDuration(token.waitingMs)}</span>
            {token.mobile && (
              <span className="flex items-center gap-1">
                <Phone size={11} /> {token.mobile}
              </span>
            )}
            {token.notes && (
              <span className="flex items-center gap-1 truncate">
                <StickyNote size={11} /> {token.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Badge status={token.status} />
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800"
          title="Move up"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800"
          title="Move down"
        >
          <ChevronDown size={16} />
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
          title="Cancel token"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
