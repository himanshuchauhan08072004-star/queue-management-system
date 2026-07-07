import { z } from "zod";

export const createTokenSchema = z.object({
  queueId: z.string().min(1, "queueId is required"),
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(80, "Customer name must be under 80 characters"),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid mobile number")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(500).optional().or(z.literal("").transform(() => undefined)),
});

export const reorderTokenSchema = z.object({
  queueId: z.string().min(1),
  tokenId: z.string().min(1),
  direction: z.enum(["UP", "DOWN"]),
});

export const serveTokenSchema = z.object({
  queueId: z.string().min(1, "queueId is required"),
});

export const cancelTokenSchema = z.object({
  tokenId: z.string().min(1, "tokenId is required"),
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;
export type ReorderTokenInput = z.infer<typeof reorderTokenSchema>;
export type ServeTokenInput = z.infer<typeof serveTokenSchema>;
export type CancelTokenInput = z.infer<typeof cancelTokenSchema>;
