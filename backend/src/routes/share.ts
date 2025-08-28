import { Router } from 'express';
import jwt from 'jsonwebtoken';

export type ShareType = 'incident' | 'postmortem';

export interface ShareTokenPayload {
  type: ShareType;
  id: string;
}

export function createShareToken(type: ShareType, id: string): string {
  return jwt.sign({ type, id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

const router = Router();

router.post('/incident/:id', (req, res) => {
  const token = createShareToken('incident', req.params.id);
  res.json({ token });
});

router.post('/postmortem/:id', (req, res) => {
  const token = createShareToken('postmortem', req.params.id);
  res.json({ token });
});

export default router;
