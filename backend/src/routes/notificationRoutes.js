import { Router } from 'express';
import { createPlaceholderController } from '../controllers/placeholderController.js';

const router = Router();
router.all('/{*path}', createPlaceholderController('Notification'));

export default router;
