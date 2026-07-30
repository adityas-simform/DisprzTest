// Routes: userRoutes.ts
// Mounts all /users resource handlers onto an Express Router.

import { Router } from 'express';

import {
  listUsers,
  getUser,
  addUser,
  editUser,
  removeUser,
} from '../controllers/userController';

const router = Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', editUser);
router.delete('/:id', removeUser);

export default router;
