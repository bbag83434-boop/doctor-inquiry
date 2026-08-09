import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, '0.0.0.0', () => {
  console.log(`Server is running on port ${env.port}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
