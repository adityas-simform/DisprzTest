// Controllers: userController.ts
// Express route handlers for the /users resource.

import type { Request, Response } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../store/userStore';
import {
  validateName,
  validateEmail,
  validateId,
} from '../validators/userValidator';
import type { CreateUserBody, UpdateUserBody } from '../types/user';

/** HTTP status codes used across controller handlers. */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
} as const;

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

/**
 * Retrieves the complete list of users.
 *
 * **Route**: `GET /users`
 *
 * @param _req - Express request object (unused).
 * @param res  - Express response object. Responds with `200` and a JSON array of users.
 *
 * @example
 * ```ts
 * // Response body
 * [{ "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "createdAt": "..." }]
 * ```
 */
export const listUsers = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(getAllUsers());
};

/**
 * Retrieves a single user by their numeric ID.
 *
 * **Route**: `GET /users/:id`
 *
 * @param req - Express request. `req.params.id` must be a positive integer string.
 * @param res - Express response. Responds with `200` and the user object, or `404` if not found.
 *
 * @example
 * ```ts
 * // GET /users/1  →  200
 * { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "createdAt": "..." }
 *
 * // GET /users/999  →  404
 * { "error": "User not found." }
 * ```
 */
export const getUser = (req: Request, res: Response): void => {
  const idValidation = validateId(req.params.id);
  if (!idValidation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: idValidation.message });
    return;
  }

  const user = getUserById(Number(req.params.id));
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found.' });
    return;
  }

  res.status(HTTP_STATUS.OK).json(user);
};

/**
 * Creates a new user from the supplied request body.
 *
 * **Route**: `POST /users`
 *
 * @param req - Express request. Body must include `name` (string) and `email` (string).
 * @param res - Express response. Responds with `201` and the created user object on success,
 *   or `400` with a validation error message.
 *
 * @example
 * ```ts
 * // POST /users  body: { "name": "Carol White", "email": "carol@example.com" }
 * // →  201
 * { "id": 3, "name": "Carol White", "email": "carol@example.com", "createdAt": "..." }
 * ```
 */
export const addUser = (
  req: Request<object, object, CreateUserBody>,
  res: Response,
): void => {
  const { name, email } = req.body;

  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: nameValidation.message });
    return;
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: emailValidation.message });
    return;
  }

  const created = createUser(name, email);
  res.status(HTTP_STATUS.CREATED).json(created);
};

/**
 * Updates the `name` and/or `email` of an existing user.
 *
 * **Route**: `PUT /users/:id`
 *
 * @param req - Express request. `req.params.id` must be a positive integer string.
 *   Body may contain optional `name` and/or `email` fields.
 * @param res - Express response. Responds with `200` and the updated user, `400` on
 *   validation failure, or `404` if the user does not exist.
 *
 * @example
 * ```ts
 * // PUT /users/1  body: { "name": "Alicia Johnson" }
 * // →  200
 * { "id": 1, "name": "Alicia Johnson", "email": "alice@example.com", "createdAt": "..." }
 * ```
 */
export const editUser = (
  req: Request<{ id: string }, object, UpdateUserBody>,
  res: Response,
): void => {
  const idValidation = validateId(req.params.id);
  if (!idValidation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: idValidation.message });
    return;
  }

  const { name, email } = req.body;

  if (name !== undefined) {
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: nameValidation.message });
      return;
    }
  }

  if (email !== undefined) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: emailValidation.message });
      return;
    }
  }

  const updated = updateUser(Number(req.params.id), name, email);
  if (!updated) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found.' });
    return;
  }

  res.status(HTTP_STATUS.OK).json(updated);
};

/**
 * Deletes the user with the given ID.
 *
 * **Route**: `DELETE /users/:id`
 *
 * @param req - Express request. `req.params.id` must be a positive integer string.
 * @param res - Express response. Responds with `204 No Content` on success,
 *   `400` on validation failure, or `404` if no matching user exists.
 *
 * @example
 * ```ts
 * // DELETE /users/2  →  204 (empty body)
 * // DELETE /users/999  →  404
 * { "error": "User not found." }
 * ```
 */
export const removeUser = (req: Request, res: Response): void => {
  const idValidation = validateId(req.params.id);
  if (!idValidation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: idValidation.message });
    return;
  }

  const removed = deleteUser(Number(req.params.id));
  if (!removed) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found.' });
    return;
  }

  res.status(HTTP_STATUS.NO_CONTENT).send();
};
