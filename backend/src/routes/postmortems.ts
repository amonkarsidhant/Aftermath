import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate';
import { searchPostmortems } from '../search';
import {
  createPostmortem,
  getPostmortem,
  updatePostmortem,
} from '../models/postmortem';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const results = await searchPostmortems(q);
    res.json({ postmortems: results });
  } catch (err) {
    next(err);
  }
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

router.post('/', validate(postmortemSchema), async (req, res, next) => {
  try {
    const postmortem = await createPostmortem(req.body);
    res.status(201).json(postmortem);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const postmortem = await getPostmortem(Number(req.params.id));
    if (!postmortem) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(postmortem);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/:id',
  validate(postmortemSchema.partial()),
  async (req, res, next) => {
    try {
      const postmortem = await updatePostmortem(
        Number(req.params.id),
        req.body
      );
      if (!postmortem) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(postmortem);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
