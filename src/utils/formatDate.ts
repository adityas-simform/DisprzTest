// Utility: formatDate.ts
// Applies global copilot-instructions.md rules (strictly typed, camelCase, error handling).

const LOCALE = 'en-US';

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/**
 * Formats a Date object or ISO date string into a human-readable string.
 *
 * @param date - A {@link Date} object or ISO 8601 string.
 * @returns A formatted date string, e.g. `"April 21, 2026"`.
 * @throws {Error} If the provided value is not a valid date.
 *
 * @example
 * ```ts
 * formatDate(new Date('2026-04-21')); // "April 21, 2026"
 * formatDate('2024-12-25');           // "December 25, 2024"
 * formatDate('not-a-date');           // throws Error
 * ```
 */
export const formatDate = (date: Date | string): string => {
  try {
    const parsed = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date value provided: "${date}"`);
    }

    return parsed.toLocaleDateString(LOCALE, DATE_FORMAT_OPTIONS);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`formatDate failed: ${error.message}`);
    }
    throw new Error('formatDate failed: unknown error');
  }
};

/**
 * Returns `true` if the given date lies before the current moment.
 *
 * @param date - A {@link Date} object or an ISO 8601 date string to evaluate.
 * @returns `true` when the provided date is in the past; `false` otherwise.
 *
 * @example
 * ```ts
 * isPastDate('2000-01-01'); // true
 * isPastDate(new Date(Date.now() + 86_400_000)); // false (tomorrow)
 * ```
 */
export const isPastDate = (date: Date | string): boolean => {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return parsed.getTime() < Date.now();
};
