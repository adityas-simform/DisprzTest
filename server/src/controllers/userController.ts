import type { Request, Response, NextFunction } from 'express';
import type { ApiSuccessResponse } from '../types/user';
import type { User } from '../types/user';
import type { CreateUserSchema, UpdateUserSchema } from '../validators/userValidator';
import { userStore } from '../store/userStore';
import { NotFoundError, ConflictError } from '../errors/AppError';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/api';

export const getAllUsers = (
  _req: Request,
  res: Response<ApiSuccessResponse<User[]>>,
): void => {
  const users = userStore.findAll();
  res.status(HTTP_STATUS.OK).json({ success: true, data: users });
};

export const getUserById = (
  req: Request<{ id: string }>,
  res: Response<ApiSuccessResponse<User>>,
  next: NextFunction,
): void => {
  const user = userStore.findById(req.params.id);
  if (!user) {
    next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    return;
  }
  res.status(HTTP_STATUS.OK).json({ success: true, data: user });
};

export const createUser = (
  req: Request<Record<string, never>, ApiSuccessResponse<User>, CreateUserSchema>,
  res: Response<ApiSuccessResponse<User>>,
  next: NextFunction,
): void => {
  const { name, email, age } = req.body;

  if (userStore.findByEmail(email)) {
    next(new ConflictError(ERROR_MESSAGES.USER_EMAIL_CONFLICT));
    return;
  }

  const user = userStore.create({ name, email, age });
  res.status(HTTP_STATUS.CREATED).json({ success: true, data: user, message: 'User created successfully.' });
};

export const updateUser = (
  req: Request<{ id: string }, ApiSuccessResponse<User>, UpdateUserSchema>,
  res: Response<ApiSuccessResponse<User>>,
  next: NextFunction,
): void => {
  const existing = userStore.findById(req.params.id);
  if (!existing) {
    next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    return;
  }

  const { email } = req.body;
  if (email && email !== existing.email && userStore.findByEmail(email)) {
    next(new ConflictError(ERROR_MESSAGES.USER_EMAIL_CONFLICT));
    return;
  }

  const updated = userStore.update(req.params.id, req.body);
  if (!updated) {
    next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    return;
  }

  res.status(HTTP_STATUS.OK).json({ success: true, data: updated, message: 'User updated successfully.' });
};

export const deleteUser = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): void => {
  const deleted = userStore.delete(req.params.id);
  if (!deleted) {
    next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    return;
  }
  res.status(HTTP_STATUS.NO_CONTENT).send();
};
