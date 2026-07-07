import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../ui/Modal";
import { useCreateToken } from "../../hooks/useTokens";

const schema = z.object({
  customerName: z.string().trim().min(2, "Enter the customer's name").max(80),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid mobile number")
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface AddTokenModalProps {
  open: boolean;
  onClose: () => void;
  queueId: string;
}

export default function AddTokenModal({ open, onClose, queueId }: AddTokenModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createToken = useCreateToken(queueId);

  async function onSubmit(values: FormValues) {
    await createToken.mutateAsync({
      queueId,
      customerName: values.customerName,
      mobile: values.mobile || undefined,
      notes: values.notes || undefined,
    });
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add a customer to the queue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-text" htmlFor="customerName">
            Customer name
          </label>
          <input
            id="customerName"
            className="input-field"
            placeholder="e.g. Priya Sharma"
            autoFocus
            {...register("customerName")}
          />
          {errors.customerName && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div>
          <label className="label-text" htmlFor="mobile">
            Mobile number <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="mobile"
            className="input-field"
            placeholder="e.g. +91 98765 43210"
            {...register("mobile")}
          />
          {errors.mobile && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.mobile.message}</p>
          )}
        </div>

        <div>
          <label className="label-text" htmlFor="notes">
            Notes <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            className="input-field resize-none"
            rows={2}
            placeholder="e.g. Requires wheelchair access"
            {...register("notes")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add to queue"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
