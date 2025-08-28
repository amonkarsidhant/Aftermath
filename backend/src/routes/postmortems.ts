import { Router } from 'express';
import { postmortems } from '../storage';
import { searchPostmortems } from '../search';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    postmortems
  });
});

router.get('/search', async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const results = await searchPostmortems(q);
    res.json({ postmortems: results });
  } catch (err) {
    next(err);
  }
});

export default router;
