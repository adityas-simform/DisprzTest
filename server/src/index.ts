// Entry point: index.ts
// Bootstraps the Express application.

import express from 'express';

import userRoutes from './routes/userRoutes';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(express.json());

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
