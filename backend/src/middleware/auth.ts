import { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

/**
 * Protects a route: requires a valid `Authorization: Bearer <token>` header.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required. Please log in.");
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const payload = verifyAuthToken(token);
    req.user = payload;
    next();
  } catch {
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }
}
