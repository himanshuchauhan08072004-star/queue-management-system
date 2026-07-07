import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../services/prisma";
import { createQueueSchema, updateQueueSchema } from "../validators/queue.schema";
import { ApiError } from "../utils/apiError";

export async function listQueues(_req: Request, res: Response) {
  const queues = await prisma.queue.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { tokens: { where: { status: "WAITING" } } },
      },
    },
  });

  res.json(
    queues.map((q: (typeof queues)[number]) => ({
      id: q.id,
      name: q.name,
      status: q.status,
      createdAt: q.createdAt,
      waitingCount: q._count.tokens,
    }))
  );
}

export async function createQueue(req: Request, res: Response) {
  const { name } = createQueueSchema.parse(req.body);

  try {
    const queue = await prisma.queue.create({ data: { name } });
    res.status(201).json(queue);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ApiError(409, `A queue named "${name}" already exists`);
    }
    throw err;
  }
}

export async function updateQueue(req: Request, res: Response) {
  const { id } = req.params;
  const data = updateQueueSchema.parse(req.body);

  const existing = await prisma.queue.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Queue not found");

  try {
    const queue = await prisma.queue.update({ where: { id }, data });
    res.json(queue);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ApiError(409, `A queue named "${data.name}" already exists`);
    }
    throw err;
  }
}

export async function deleteQueue(req: Request, res: Response) {
  const { id } = req.params;

  const existing = await prisma.queue.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Queue not found");

  await prisma.queue.delete({ where: { id } });
  res.status(204).send();
}
