import { Router } from 'express';
import { collectTimelineEvents } from '../../../integrations/src/timeline';
import { createIntegrations } from '../../../integrations/src';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const start = req.query.start ? new Date(req.query.start as string) : new Date(0);
    const end = req.query.end ? new Date(req.query.end as string) : new Date();
    const providers = typeof req.query.providers === 'string'
      ? (req.query.providers as string).split(',')
      : undefined;
    const category = typeof req.query.category === 'string' ? (req.query.category as 'human' | 'system') : undefined;

    const all = createIntegrations();
    const selected = providers
      ? Object.fromEntries(Object.entries(all).filter(([k]) => providers.includes(k)))
      : all;

    const events = await collectTimelineEvents(start, end, selected);
    const filtered = category ? events.filter((e) => e.category === category) : events;
    res.json({ events: filtered });
  } catch (err) {
    next(err);
  }
});

export default router;
