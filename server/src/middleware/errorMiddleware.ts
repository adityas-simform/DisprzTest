import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/AppError';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/api';
import type { ApiErrorResponse } from '../types/user';

/**
 * Global error-handling middleware.  Must be registered last in the Express
 * app (after all routes) and must declare four parameters.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ValidationError) {
    const body: ApiErrorResponse = {
      success: false,
      error: err.message,
      details: err.details,
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof AppError) {
    const body: ApiErrorResponse = {
      success: false,
      error: err.message,
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown / programming errors — do not leak details in production
  console.error('[Unhandled Error]', err);

  const body: ApiErrorResponse = {
    success: false,
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  };
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(body);
};

/** Handles requests to routes that do not exist. */
export const notFoundHandler = (_req: Request, res: Response): void => {
  const body: ApiErrorResponse = {
    success: false,
    error: 'The requested endpoint does not exist.',
  };
  res.status(HTTP_STATUS.NOT_FOUND).json(body);
};
