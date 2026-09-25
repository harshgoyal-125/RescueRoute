import { Router } from 'express';
import { isDbConnected } from '../config/db.js';

const router = Router();

router.get('/', (_req, res) => {
  const dbStatus = isDbConnected() ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'online',
      database: dbStatus
    }
  });
});

export default router;
