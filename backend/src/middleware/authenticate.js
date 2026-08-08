import jwt from 'jsonwebtoken';
import { env, requireJwtSecrets } from '../config/env.js';
import { prisma } from '../database/prisma.js';
import { ApiError } from './errorHandler.js';

export async function requireAuth(req, _res, next) {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) return next(new ApiError('Authentication is required.', 401));

  try {
    requireJwtSecrets();
    const payload = jwt.verify(header.slice(7), env.jwtAccessSecret);
    if (payload.type !== 'access' || !payload.sub) throw new Error('Invalid token type.');
    const session = await prisma.session.findFirst({ where: { id: payload.sessionId, userId: payload.sub, expiresAt: { gt: new Date() }, user: { isActive: true } }, select: { id: true } });
    if (!session) throw new Error('Session is no longer active.');
    req.auth = { userId: payload.sub, sessionId: payload.sessionId };
    return next();
  } catch {
    return next(new ApiError('Your session is invalid or has expired.', 401));
  }
}
