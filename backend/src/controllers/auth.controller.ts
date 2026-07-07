import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../services/prisma";
import { loginSchema } from "../validators/auth.schema";
import { signAuthToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAuthToken({ userId: user.id, email: user.email });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}

export async function me(req: Request & { user?: { userId: string } }, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ id: user.id, name: user.name, email: user.email });
}
