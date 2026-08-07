import { Router } from 'express';
import { createPlaceholderController } from '../controllers/placeholderController.js';

const router = Router();
router.all('*', createPlaceholderController('Doctor'));

export default router;
