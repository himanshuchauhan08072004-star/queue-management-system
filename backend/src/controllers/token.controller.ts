import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import {
  createTokenSchema,
  reorderTokenSchema,
  serveTokenSchema,
  cancelTokenSchema,
} from "../validators/token.schema";
import { ApiError } from "../utils/apiError";

const TOKEN_PREFIX = "A";

/**
 * Builds the next sequential token number for a queue, e.g. A-001, A-002.
 * Based on the total number of tokens ever created in the queue, so
 * numbers stay unique and increasing even after cancellations.
 */
async function nextTokenNumber(queueId: string): Promise<string> {
  const count = await prisma.token.count({ where: { queueId } });
  return `${TOKEN_PREFIX}-${String(count + 1).padStart(3, "0")}`;
}

function withWaitingTime<T extends { createdAt: Date; completedAt: Date | null }>(
  token: T
) {
  const end = token.completedAt ?? new Date();
  const waitingMs = end.getTime() - token.createdAt.getTime();
  return { ...token, waitingMs };
}

/** GET /tokens?queueId=&status= */
export async function listTokens(req: Request, res: Response) {
  const { queueId, status } = req.query as { queueId?: string; status?: string };

  const tokens = await prisma.token.findMany({
    where: {
      ...(queueId ? { queueId } : {}),
      ...(status ? { status: status as any } : {}),
    },
    orderBy: [{ status: "asc" }, { position: "asc" }, { createdAt: "asc" }],
  });

  res.json(tokens.map((t: (typeof tokens)[number]) => withWaitingTime(t)));
}

/** POST /tokens */
export async function createToken(req: Request, res: Response) {
  const data = createTokenSchema.parse(req.body);

  const queue = await prisma.queue.findUnique({ where: { id: data.queueId } });
  if (!queue) throw new ApiError(404, "Queue not found");

  const maxPosition = await prisma.token.aggregate({
    where: { queueId: data.queueId, status: "WAITING" },
    _max: { position: true },
  });

  const tokenNumber = await nextTokenNumber(data.queueId);

  const token = await prisma.token.create({
    data: {
      queueId: data.queueId,
      customerName: data.customerName,
      mobile: data.mobile,
      notes: data.notes,
      tokenNumber,
      status: "WAITING",
      position: (maxPosition._max.position ?? 0) + 1,
    },
  });

  res.status(201).json(withWaitingTime(token));
}

/** PATCH /tokens/reorder  { queueId, tokenId, direction: 'UP' | 'DOWN' } */
export async function reorderToken(req: Request, res: Response) {
  const { queueId, tokenId, direction } = reorderTokenSchema.parse(req.body);

  const waitingTokens = await prisma.token.findMany({
    where: { queueId, status: "WAITING" },
    orderBy: { position: "asc" },
  });

  const index = waitingTokens.findIndex((t: (typeof waitingTokens)[number]) => t.id === tokenId);
  if (index === -1) throw new ApiError(404, "Token not found in waiting list");

  const swapIndex = direction === "UP" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= waitingTokens.length) {
    // Already at the boundary; nothing to do.
    res.json(waitingTokens.map((t: (typeof waitingTokens)[number]) => withWaitingTime(t)));
    return;
  }

  const current = waitingTokens[index];
  const neighbor = waitingTokens[swapIndex];

  await prisma.$transaction([
    prisma.token.update({ where: { id: current.id }, data: { position: neighbor.position } }),
    prisma.token.update({ where: { id: neighbor.id }, data: { position: current.position } }),
  ]);

  const updated = await prisma.token.findMany({
    where: { queueId, status: "WAITING" },
    orderBy: { position: "asc" },
  });

  res.json(updated.map((t: (typeof updated)[number]) => withWaitingTime(t)));
}

/** PATCH /tokens/serve  { queueId } — completes the first waiting token */
export async function serveToken(req: Request, res: Response) {
  const { queueId } = serveTokenSchema.parse(req.body);

  const next = await prisma.token.findFirst({
    where: { queueId, status: "WAITING" },
    orderBy: { position: "asc" },
  });

  if (!next) throw new ApiError(400, "There are no waiting tokens to serve");

  const now = new Date();
  const served = await prisma.token.update({
    where: { id: next.id },
    data: { status: "COMPLETED", startedAt: now, completedAt: now },
  });

  res.json(withWaitingTime(served));
}

/** PATCH /tokens/cancel  { tokenId } */
export async function cancelToken(req: Request, res: Response) {
  const { tokenId } = cancelTokenSchema.parse(req.body);

  const token = await prisma.token.findUnique({ where: { id: tokenId } });
  if (!token) throw new ApiError(404, "Token not found");
  if (token.status !== "WAITING") {
    throw new ApiError(400, "Only waiting tokens can be cancelled");
  }

  const cancelled = await prisma.token.update({
    where: { id: tokenId },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  res.json(withWaitingTime(cancelled));
}
