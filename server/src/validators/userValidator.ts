// Validators: userValidator.ts
// Input-validation helpers for user-related request bodies.

/** Minimum allowed length for a user name. */
const MIN_NAME_LENGTH = 2;

/** Maximum allowed length for a user name. */
const MAX_NAME_LENGTH = 100;

/**
 * A linear-time email validation pattern.
 * Checks for a local part, an `@` symbol, and a domain.
 * Deliberately simple to avoid ReDoS backtracking risks.
 */
const EMAIL_REGEX = /^[^@\s]{1,64}@[^@\s]{1,253}$/;

/** Shape of a successful validation result. */
export interface ValidationSuccess {
  valid: true;
}

/** Shape of a failed validation result. */
export interface ValidationFailure {
  valid: false;
  /** Human-readable description of what went wrong. */
  message: string;
}

/** Union of both possible validation outcomes. */
export type ValidationResult = ValidationSuccess | ValidationFailure;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validates the `name` field for user creation and update requests.
 *
 * The name must be a non-empty string between
 * {@link MIN_NAME_LENGTH} and {@link MAX_NAME_LENGTH} characters.
 *
 * @param name - The raw value supplied by the caller.
 * @returns A {@link ValidationResult} — `{ valid: true }` on success, or
 *   `{ valid: false, message: string }` describing the problem.
 *
 * @example
 * ```ts
 * validateName('Alice'); // { valid: true }
 * validateName('');      // { valid: false, message: '...' }
 * ```
 */
export const validateName = (name: unknown): ValidationResult => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, message: 'name must be a non-empty string.' };
  }
  if (name.trim().length < MIN_NAME_LENGTH) {
    return {
      valid: false,
      message: `name must be at least ${MIN_NAME_LENGTH} characters.`,
    };
  }
  if (name.trim().length > MAX_NAME_LENGTH) {
    return {
      valid: false,
      message: `name must be at most ${MAX_NAME_LENGTH} characters.`,
    };
  }
  return { valid: true };
};

/**
 * Validates the `email` field for user creation and update requests.
 *
 * The value must be a non-empty string that matches the {@link EMAIL_REGEX} pattern.
 *
 * @param email - The raw value supplied by the caller.
 * @returns A {@link ValidationResult} — `{ valid: true }` on success, or
 *   `{ valid: false, message: string }` describing the problem.
 *
 * @example
 * ```ts
 * validateEmail('alice@example.com'); // { valid: true }
 * validateEmail('not-an-email');      // { valid: false, message: '...' }
 * ```
 */
export const validateEmail = (email: unknown): ValidationResult => {
  if (typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, message: 'email must be a non-empty string.' };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, message: 'email must be a valid email address.' };
  }
  return { valid: true };
};

/**
 * Validates that a route parameter can be parsed as a positive integer ID.
 *
 * @param raw - The raw string value extracted from the URL, e.g. `req.params.id`.
 * @returns A {@link ValidationResult} — `{ valid: true }` on success, or
 *   `{ valid: false, message: string }` describing the problem.
 *
 * @example
 * ```ts
 * validateId('42');   // { valid: true }
 * validateId('abc');  // { valid: false, message: '...' }
 * validateId('-1');   // { valid: false, message: '...' }
 * ```
 */
export const validateId = (raw: string): ValidationResult => {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { valid: false, message: 'id must be a positive integer.' };
  }
  return { valid: true };
};
