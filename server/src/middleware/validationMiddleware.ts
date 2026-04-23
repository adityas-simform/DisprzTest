import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/api';
import { ValidationError } from '../errors/AppError';

type RequestPart = 'body' | 'params' | 'query';

/**
 * Returns an Express middleware that validates the specified part of the
 * request against the provided Zod schema.  On failure it throws a
 * `ValidationError` which is caught by the global error handler.
 */
export const validate =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[part]);
      // Replace the request part with the coerced/trimmed Zod output
      (req as unknown as Record<string, unknown>)[part] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const field = issue.path.join('.') || '_root';
          if (!details[field]) {
            details[field] = [];
          }
          details[field].push(issue.message);
        }
        next(new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED, details));
      } else {
        next(new Error(`Unexpected validation error at status ${HTTP_STATUS.BAD_REQUEST}`));
      }
    }
  };
