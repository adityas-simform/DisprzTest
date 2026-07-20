import { HTTP_STATUS } from '../constants/api';

/** Base application error — extend to create domain-specific errors. */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class ValidationError extends AppError {
  public readonly details: Record<string, string[]>;

  constructor(message: string, details: Record<string, string[]>) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.details = details;
  }
}
