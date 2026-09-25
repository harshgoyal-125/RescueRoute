import { Router } from 'express';
import { getImpactMetrics } from '../controllers/dashboardController.js';

const router = Router();

router.get('/impact', getImpactMetrics);

export default router;
