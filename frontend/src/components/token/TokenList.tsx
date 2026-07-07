import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PlayCircle, Users2 } from "lucide-react";
import { Token } from "../../types";
import TokenCard from "./TokenCard";
import Modal from "../ui/Modal";
import EmptyState from "../ui/EmptyState";
import { TokenCardSkeleton } from "../ui/Skeleton";
import {
  useCancelToken,
  useReorderToken,
  useServeToken,
} from "../../hooks/useTokens";

interface TokenListProps {
  queueId: string;
  tokens: Token[];
  isLoading: boolean;
  onAddTokenClick: () => void;
}

export default function TokenList({ queueId, tokens, isLoading, onAddTokenClick }: TokenListProps) {
  const waitingTokens = tokens
    .filter((t) => t.status === "WAITING")
    .sort((a, b) => a.position - b.position);

  const reorderToken = useReorderToken(queueId);
  const serveToken = useServeToken(queueId);
  const cancelToken = useCancelToken(queueId);

  const [tokenToCancel, setTokenToCancel] = useState<Token | null>(null);

  async function handleCancelConfirm() {
    if (!tokenToCancel) return;
    await cancelToken.mutateAsync(tokenToCancel.id);
    setTokenToCancel(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <TokenCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Waiting tokens{" "}
          <span className="ml-1 text-sm font-medium text-slate-400">
            ({waitingTokens.length})
          </span>
        </h2>
        <button
          onClick={() => serveToken.mutate()}
          disabled={waitingTokens.length === 0 || serveToken.isPending}
          className="btn-primary"
        >
          <PlayCircle size={17} />
          {serveToken.isPending ? "Serving..." : "Serve Next"}
        </button>
      </div>

      {waitingTokens.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No one is waiting"
          description="Add a customer to this queue to get started."
          action={
            <button onClick={onAddTokenClick} className="btn-primary mt-2">
              Add customer
            </button>
          }
        />
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-3">
            {waitingTokens.map((token, index) => (
              <TokenCard
                key={token.id}
                token={token}
                position={index + 1}
                isFirst={index === 0}
                isLast={index === waitingTokens.length - 1}
                onMoveUp={() =>
                  reorderToken.mutate({ tokenId: token.id, direction: "UP" })
                }
                onMoveDown={() =>
                  reorderToken.mutate({ tokenId: token.id, direction: "DOWN" })
                }
                onCancel={() => setTokenToCancel(token)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <Modal
        open={!!tokenToCancel}
        onClose={() => setTokenToCancel(null)}
        title="Cancel this token?"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will cancel token{" "}
          <span className="font-semibold">{tokenToCancel?.tokenNumber}</span> for{" "}
          <span className="font-semibold">{tokenToCancel?.customerName}</span>. This action
          cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setTokenToCancel(null)}>
            Keep waiting
          </button>
          <button
            className="btn-danger"
            onClick={handleCancelConfirm}
            disabled={cancelToken.isPending}
          >
            {cancelToken.isPending ? "Cancelling..." : "Yes, cancel token"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
