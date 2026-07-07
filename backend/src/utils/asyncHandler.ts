import { NextFunction, Request, Response } from "express";

/**
 * Wraps an async Express handler so rejected promises are forwarded
 * to the centralised error handler instead of crashing the process.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
