import express from 'express';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';
import { API_PREFIX } from './constants/api';

const app = express();

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use(`${API_PREFIX}/users`, userRoutes);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

export default app;
