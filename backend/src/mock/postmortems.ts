import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate';
import { postmortems } from './data';

const router = Router();

router.get('/search', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
  const results = postmortems.filter((p) =>
    (p.summary || '').toLowerCase().includes(q)
  );
  res.json({ postmortems: results });
});

const postmortemSchema = z.object({
  incident_id: z.number(),
  summary: z.string().optional(),
  impact: z.string().optional(),
  root_cause: z.string().optional(),
  resolution: z.string().optional(),
  timeline: z.unknown().optional(),
  lessons: z.string().optional(),
});

router.post('/', validate(postmortemSchema), (req, res) => {
  const id = postmortems.length
    ? Math.max(...postmortems.map((p) => p.id)) + 1
    : 1;
  const postmortem = { id, ...req.body };
  postmortems.push(postmortem);
  res.status(201).json(postmortem);
});

router.get('/:id', (req, res) => {
  const postmortem = postmortems.find((p) => p.id === Number(req.params.id));
  if (!postmortem) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(postmortem);
});

router.put(
  '/:id',
  validate(postmortemSchema.partial()),
  (req, res) => {
    const postmortem = postmortems.find((p) => p.id === Number(req.params.id));
    if (!postmortem) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    Object.assign(postmortem, req.body);
    res.json(postmortem);
  }
);

export default router;
