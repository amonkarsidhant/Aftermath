import { Router } from 'express';
import { incidents } from './data';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ incidents });
});

router.get('/:id', (req, res) => {
  const incident = incidents.find((i) => i.id === Number(req.params.id));
  if (!incident) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(incident);
});

export default router;
