import app from './app';

const PORT = process.env.PORT ?? '3000';

app.listen(Number(PORT), () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] API base: http://localhost:${PORT}/api/v1`);
});
