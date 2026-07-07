import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../ui/Modal";
import { useCreateQueue } from "../../hooks/useQueues";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Queue name must be at least 2 characters")
    .max(60, "Queue name must be under 60 characters"),
});

type FormValues = z.infer<typeof schema>;

interface CreateQueueModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateQueueModal({ open, onClose }: CreateQueueModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createQueue = useCreateQueue();

  async function onSubmit(values: FormValues) {
    await createQueue.mutateAsync(values.name);
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Create a new queue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-text" htmlFor="queue-name">
            Queue name
          </label>
          <input
            id="queue-name"
            className="input-field"
            placeholder="e.g. Counter 1 — General Service"
            autoFocus
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.name.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create queue"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
