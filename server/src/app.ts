import express from 'express';

import { API_PREFIX, HEALTH_ENDPOINT } from './constants/api';
import healthRoutes from './routes/healthRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

const app = express();

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use(`${API_PREFIX}${HEALTH_ENDPOINT}`, healthRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

export default app;
