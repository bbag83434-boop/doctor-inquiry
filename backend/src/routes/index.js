import { Router } from 'express';
import appointmentRouter from './appointmentRoutes.js';
import authRouter from './authRoutes.js';
import doctorRouter from './doctorRoutes.js';
import healthRouter from './healthRoutes.js';
import notificationRouter from './notificationRoutes.js';
import patientRouter from './patientRoutes.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/doctors', doctorRouter);
router.use('/appointments', appointmentRouter);
router.use('/patients', patientRouter);
router.use('/notifications', notificationRouter);

export default router;
