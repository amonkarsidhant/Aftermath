import { Router } from 'express';
import { actions } from '../storage';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    actions
  });
});

export default router;
