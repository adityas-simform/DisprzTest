/** HTTP status codes used across the API */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_PREFIX = '/api/v1';

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found.',
  USER_EMAIL_CONFLICT: 'A user with this email already exists.',
  VALIDATION_FAILED: 'Validation failed.',
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
} as const;
