// Store: userStore.ts
// In-memory store for User records. Acts as a lightweight data layer.

import type { User } from '../types/user';

/** Seed data for the in-memory store. */
const SEED_USERS: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    createdAt: '2024-02-20T14:30:00.000Z',
  },
];

let users: User[] = [...SEED_USERS];
let nextId = 3;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns a shallow copy of all users currently in the store.
 *
 * @returns An array of {@link User} objects.
 *
 * @example
 * ```ts
 * const all = getAllUsers();
 * console.log(all.length); // 2
 * ```
 */
export const getAllUsers = (): User[] => [...users];

/**
 * Finds and returns the user with the given ID, or `undefined` if not found.
 *
 * @param id - The numeric ID of the user to look up.
 * @returns The matching {@link User}, or `undefined`.
 *
 * @example
 * ```ts
 * const user = getUserById(1);
 * console.log(user?.name); // "Alice Johnson"
 * ```
 */
export const getUserById = (id: number): User | undefined =>
  users.find((u) => u.id === id);

/**
 * Creates a new user, persists it in the store, and returns the created record.
 *
 * @param name  - The full name of the new user.
 * @param email - The email address of the new user.
 * @returns The newly created {@link User} with an auto-assigned `id` and `createdAt`.
 *
 * @example
 * ```ts
 * const newUser = createUser('Carol White', 'carol@example.com');
 * console.log(newUser.id); // 3
 * ```
 */
export const createUser = (name: string, email: string): User => {
  const newUser: User = {
    id: nextId++,
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

/**
 * Updates the `name` and/or `email` of an existing user.
 * Returns the updated record, or `undefined` if no user with that ID exists.
 *
 * @param id    - The numeric ID of the user to update.
 * @param name  - Optional new name.
 * @param email - Optional new email.
 * @returns The updated {@link User}, or `undefined` if not found.
 *
 * @example
 * ```ts
 * const updated = updateUser(1, 'Alicia Johnson', undefined);
 * console.log(updated?.name); // "Alicia Johnson"
 * ```
 */
export const updateUser = (
  id: number,
  name?: string,
  email?: string,
): User | undefined => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return undefined;
  }
  const existing = users[index];
  const updated: User = {
    ...existing,
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
  };
  users[index] = updated;
  return updated;
};

/**
 * Removes the user with the given ID from the store.
 *
 * @param id - The numeric ID of the user to delete.
 * @returns `true` if a user was removed; `false` if no matching user was found.
 *
 * @example
 * ```ts
 * const removed = deleteUser(2);
 * console.log(removed); // true
 * ```
 */
export const deleteUser = (id: number): boolean => {
  const before = users.length;
  users = users.filter((u) => u.id !== id);
  return users.length < before;
};
