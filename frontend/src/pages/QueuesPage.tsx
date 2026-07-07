import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ListOrdered } from "lucide-react";
import { useQueues, useDeleteQueue, useUpdateQueue } from "../hooks/useQueues";
import QueueList from "../components/queue/QueueList";
import CreateQueueModal from "../components/queue/CreateQueueModal";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { Queue } from "../types";

export default function QueuesPage() {
  const { data: queues, isLoading } = useQueues();
  const deleteQueue = useDeleteQueue();
  const updateQueue = useUpdateQueue();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [queueToDelete, setQueueToDelete] = useState<Queue | null>(null);

  const filteredQueues = useMemo(() => {
    if (!queues) return [];
    return queues.filter((q) => q.name.toLowerCase().includes(search.toLowerCase()));
  }, [queues, search]);

  function handleToggleStatus(queue: Queue) {
    updateQueue.mutate({ id: queue.id, status: queue.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
  }

  async function handleDeleteConfirm() {
    if (!queueToDelete) return;
    await deleteQueue.mutateAsync(queueToDelete.id);
    setQueueToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Queues</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage your service queues.
          </p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary">
          <Plus size={17} /> New queue
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input-field pl-10"
          placeholder="Search queues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredQueues.length === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title={queues?.length ? "No queues match your search" : "No queues yet"}
          description={
            queues?.length
              ? "Try a different search term."
              : "Create your first queue to start managing customer tokens."
          }
          action={
            !queues?.length ? (
              <button onClick={() => setCreateOpen(true)} className="btn-primary mt-2">
                Create a queue
              </button>
            ) : undefined
          }
        />
      ) : (
        <QueueList
          queues={filteredQueues}
          selectedQueueId={null}
          onSelect={(id) => navigate(`/queues/${id}`)}
          onToggleStatus={handleToggleStatus}
          onDelete={setQueueToDelete}
        />
      )}

      <CreateQueueModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <Modal
        open={!!queueToDelete}
        onClose={() => setQueueToDelete(null)}
        title="Delete this queue?"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete{" "}
          <span className="font-semibold">{queueToDelete?.name}</span> and all of its tokens.
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setQueueToDelete(null)}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleDeleteConfirm} disabled={deleteQueue.isPending}>
            {deleteQueue.isPending ? "Deleting..." : "Delete queue"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
