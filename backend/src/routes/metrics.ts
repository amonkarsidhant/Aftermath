import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    metrics: {
      uptime: 99.9,
      incidentsLastWeek: 5
    }
  });
});

export default router;
