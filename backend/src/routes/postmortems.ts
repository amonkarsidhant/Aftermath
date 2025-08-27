import { Router } from 'express';
import { postmortems } from '../storage';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    postmortems
  });
});

export default router;
