import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env, requireJwtSecrets } from '../config/env.js';
import { prisma } from '../database/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { successResponse } from '../services/apiResponse.js';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_COOKIE = 'doctor_inquiry_refresh';
const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
const REMEMBERED_REFRESH_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const SESSION_REFRESH_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function safeUser(user) {
  return { id: user.id, fullName: user.fullName, name: user.fullName, mobileNumber: user.phone, email: user.email, role: user.role.toLowerCase() };
}

function normalizeMobile(value) {
  let s = String(value ?? '').replace(/\D/g, '');
  if (s.length === 12 && s.startsWith('91')) {
    s = s.substring(2);
  }
  return s;
}
function normalizeEmail(value) { return value ? String(value).trim().toLowerCase() : null; }
function hashToken(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function validateRegistration(body) {
  const fullName = String(body.fullName ?? '').trim();
  const mobileNumber = normalizeMobile(body.mobileNumber);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? '');
  if (fullName.length < 2 || fullName.length > 100) throw new ApiError('Please enter your full name.', 400);
  if (!MOBILE_PATTERN.test(mobileNumber)) throw new ApiError('Please enter a valid 10-digit Indian mobile number.', 400);
  if (email && !EMAIL_PATTERN.test(email)) throw new ApiError('Please enter a valid email address.', 400);
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) throw new ApiError('Password must be at least 8 characters and include a letter and a number.', 400);
  return { fullName, mobileNumber, email, password };
}

function signAccessToken(user, sessionId) {
  requireJwtSecrets();
  return jwt.sign({ type: 'access', sessionId, role: user.role }, env.jwtAccessSecret, { subject: user.id, expiresIn: env.jwtAccessExpiresIn });
}

function signRefreshToken(user, sessionId) {
  requireJwtSecrets();
  return jwt.sign({ type: 'refresh', sessionId }, env.jwtRefreshSecret, { subject: user.id, expiresIn: env.jwtRefreshExpiresIn });
}

function setRefreshCookie(res, refreshToken, rememberMe) {
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', path: '/api/v1/auth',
    ...(rememberMe ? { maxAge: REMEMBERED_REFRESH_MAX_AGE_MS } : {}),
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', path: '/api/v1/auth' });
}

async function createSession(user, rememberMe) {
  const expiresAt = new Date(Date.now() + (rememberMe ? REMEMBERED_REFRESH_MAX_AGE_MS : SESSION_REFRESH_MAX_AGE_MS));
  const session = await prisma.session.create({ data: { userId: user.id, token: crypto.randomBytes(32).toString('hex'), expiresAt } });
  const refreshToken = signRefreshToken(user, session.id);
  await prisma.session.update({ where: { id: session.id }, data: { token: hashToken(refreshToken) } });
  return { session, refreshToken };
}

function sendAuthenticated(res, user, session, refreshToken, rememberMe) {
  setRefreshCookie(res, refreshToken, rememberMe);
  return res.status(200).json(successResponse({ accessToken: signAccessToken(user, session.id), expiresInMs: ACCESS_TOKEN_MAX_AGE_MS, user: safeUser(user) }));
}

export async function register(req, res, next) {
  try {
    const { fullName, mobileNumber, email, password } = validateRegistration(req.body);
    const duplicate = await prisma.user.findFirst({ where: { OR: [{ phone: mobileNumber }, ...(email ? [{ email }] : [])] } });
    if (duplicate) throw new ApiError(duplicate.phone === mobileNumber ? 'An account with this mobile number already exists.' : 'An account with this email address already exists.', 409);
    const user = await prisma.user.create({ data: { fullName, phone: mobileNumber, email, passwordHash: await bcrypt.hash(password, 12), patient: { create: {} } } });
    const rememberMe = Boolean(req.body.rememberMe);
    const { session, refreshToken } = await createSession(user, rememberMe);
    return sendAuthenticated(res, user, session, refreshToken, rememberMe);
  } catch (error) { return next(error); }
}

export async function login(req, res, next) {
  try {
    const normalized = normalizeMobile(req.body.mobileNumber);
    const password = String(req.body.password ?? '');
    if (!MOBILE_PATTERN.test(normalized) || !password) throw new ApiError('Please enter your mobile number and password.', 400);
    let user = await prisma.user.findUnique({ where: { phone: normalized } });
    // Compatibility for existing users stored with country code 91
    if (!user && normalized.length === 10) {
      user = await prisma.user.findUnique({ where: { phone: '91' + normalized } });
    }
    const validPassword = Boolean(user?.passwordHash) && await bcrypt.compare(password, user.passwordHash);
    if (!validPassword || !user?.isActive) throw new ApiError('Invalid mobile number or password.', 401);
    const rememberMe = Boolean(req.body.rememberMe);
    const { session, refreshToken } = await createSession(user, rememberMe);
    return sendAuthenticated(res, user, session, refreshToken, rememberMe);
  } catch (error) { return next(error); }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (!refreshToken) throw new ApiError('Your session has expired. Please sign in again.', 401);
    requireJwtSecrets();
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
    if (payload.type !== 'refresh' || !payload.sub || !payload.sessionId) throw new Error('Invalid refresh token.');
    const session = await prisma.session.findFirst({ where: { id: payload.sessionId, userId: payload.sub, token: hashToken(refreshToken), expiresAt: { gt: new Date() }, user: { isActive: true } }, include: { user: true } });
    if (!session) throw new ApiError('Your session has expired. Please sign in again.', 401);
    const rememberMe = session.expiresAt.getTime() - Date.now() > SESSION_REFRESH_MAX_AGE_MS;
    await prisma.session.delete({ where: { id: session.id } });
    const nextSession = await createSession(session.user, rememberMe);
    return sendAuthenticated(res, session.user, nextSession.session, nextSession.refreshToken, rememberMe);
  } catch (error) {
    clearRefreshCookie(res);
    return next(error instanceof ApiError ? error : new ApiError('Your session is invalid or has expired.', 401));
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (refreshToken) await prisma.session.deleteMany({ where: { token: hashToken(refreshToken) } });
    clearRefreshCookie(res);
    return res.status(200).json(successResponse({ message: 'Logged out successfully.' }));
  } catch (error) { return next(error); }
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.auth.userId, isActive: true } });
    if (!user) throw new ApiError('User account was not found.', 401);
    return res.status(200).json(successResponse({ user: safeUser(user) }));
  } catch (error) { return next(error); }
}
