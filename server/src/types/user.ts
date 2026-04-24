// Types: user.ts
// Shared TypeScript interfaces for the User domain.

/** Represents a user entity stored in memory. */
export interface User {
  /** Unique numeric identifier generated at creation time. */
  id: number;
  /** Full name of the user. */
  name: string;
  /** Email address of the user. Must be unique. */
  email: string;
  /** ISO 8601 timestamp string of when the user was created. */
  createdAt: string;
}

/** Shape of the request body accepted when creating a new user. */
export interface CreateUserBody {
  name: string;
  email: string;
}

/** Shape of the request body accepted when updating an existing user. */
export interface UpdateUserBody {
  name?: string;
  email?: string;
}
