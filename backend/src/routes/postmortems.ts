import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    postmortems: [
      { id: 1, incidentId: 1, summary: 'Resolved database outage' },
      { id: 2, incidentId: 2, summary: 'Fixed network configuration' }
    ]
  });
});

export default router;
