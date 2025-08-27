import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    actions: [
      { id: 1, description: 'Restart database service' },
      { id: 2, description: 'Update firewall rules' }
    ]
  });
});

export default router;
