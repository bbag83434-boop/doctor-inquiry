import dotenv from 'dotenv';

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? '5000', 10);

if (Number.isNaN(port)) {
  throw new Error('PORT must be a valid number.');
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port,
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
});

export function requireDatabaseUrl() {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL must be configured in the backend .env file.');
  }

  if (!env.databaseUrl.startsWith('postgresql://') && !env.databaseUrl.startsWith('postgres://')) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection string.');
  }

  return env.databaseUrl;
}

export function requireJwtSecrets() {
  if (!env.jwtAccessSecret || !env.jwtRefreshSecret) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be configured in the backend .env file.');
  }

  return env;
}
