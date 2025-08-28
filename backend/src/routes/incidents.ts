import { Router } from 'express';
import { listIncidents, getIncident } from '../models/incident';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const incidents = await listIncidents();
    res.json({ incidents });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const incident = await getIncident(Number(req.params.id));
    if (!incident) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(incident);
  } catch (err) {
    next(err);
  }
});

export default router;
