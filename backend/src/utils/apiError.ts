/**
 * Typed application error carrying an HTTP status code.
 * Thrown from controllers/services, caught by the central error handler.
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
