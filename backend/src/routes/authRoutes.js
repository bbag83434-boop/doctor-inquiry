import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getCurrentUser, login, logout, refresh, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authenticate.js';

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many authentication attempts. Please try again later.' } },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', requireAuth, getCurrentUser);

export default router;
