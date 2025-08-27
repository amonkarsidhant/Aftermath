import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    incidents: [
      { id: 1, title: 'Database outage' },
      { id: 2, title: 'Network issue' }
    ]
  });
});

export default router;
