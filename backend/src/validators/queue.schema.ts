import { z } from "zod";

export const createQueueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Queue name must be at least 2 characters")
    .max(60, "Queue name must be under 60 characters"),
});

export const updateQueueSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type CreateQueueInput = z.infer<typeof createQueueSchema>;
export type UpdateQueueInput = z.infer<typeof updateQueueSchema>;
