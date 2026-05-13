import { Router } from 'express';

import { getHealth } from '../controllers/healthController';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Returns the server health status
 */
router.get('/', getHealth);

export default router;
