/**
 * Single shared Prisma client instance (avoids exhausting DB connections
 * during development hot-reloads).
 */
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
