import app from './app';

const DEFAULT_PORT = '3000';
const MIN_PORT = 1;
const MAX_PORT = 65535;

const parsePort = (portValue: string): number => {
  const parsedPort = Number(portValue);

  if (!Number.isInteger(parsedPort) || parsedPort < MIN_PORT || parsedPort > MAX_PORT) {
    throw new Error(
      `[Server] Invalid PORT value "${portValue}". Expected an integer between ${MIN_PORT} and ${MAX_PORT}.`,
    );
  }

  return parsedPort;
};

const port = parsePort(process.env.PORT ?? DEFAULT_PORT);

app.listen(port, () => {
  console.log(`[Server] Running on http://localhost:${port}`);
  console.log(`[Server] API base: http://localhost:${port}/api/v1`);
});
