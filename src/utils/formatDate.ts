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
 * @param date - A Date object or ISO 8601 string.
 * @returns A formatted date string, e.g. "April 21, 2026".
 * @throws Error if the provided value is not a valid date.
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
 * Returns true if the given date is in the past.
 */
export const isPastDate = (date: Date | string): boolean => {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return parsed.getTime() < Date.now();
};
