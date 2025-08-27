import { Router } from 'express';
import { incidents } from '../storage';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    incidents
  });
});

export default router;
