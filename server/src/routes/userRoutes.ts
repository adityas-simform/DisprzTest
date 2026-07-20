import { Router } from 'express';
import { validate } from '../middleware/validationMiddleware';
import { createUserSchema, updateUserSchema } from '../validators/userValidator';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

/**
 * @route   GET /api/v1/users
 * @desc    Retrieve all users
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Retrieve a single user by ID
 */
router.get('/:id', getUserById);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user
 * @body    { name: string, email: string, age: number }
 */
router.post('/', validate(createUserSchema), createUser);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Partially update an existing user
 * @body    { name?: string, email?: string, age?: number }
 */
router.patch('/:id', validate(updateUserSchema), updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user by ID
 */
router.delete('/:id', deleteUser);

export default router;
