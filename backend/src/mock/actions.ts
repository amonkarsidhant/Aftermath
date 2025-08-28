import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate';
import { actions } from './data';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ actions });
});

const actionSchema = z.object({
  postmortem_id: z.number(),
  description: z.string(),
  owner: z.string(),
  status: z.string(),
  due_date: z.string().optional(),
});

router.post('/', validate(actionSchema), (req, res) => {
  const id = actions.length ? Math.max(...actions.map((a) => a.id)) + 1 : 1;
  const action = {
    id,
    postmortem_id: req.body.postmortem_id,
    description: req.body.description,
    owner: req.body.owner,
    status: req.body.status,
    due_date: req.body.due_date ? new Date(req.body.due_date) : null,
  };
  actions.push(action);
  res.status(201).json(action);
});

const statusSchema = z.object({
  status: z.string(),
});

router.patch('/:id', validate(statusSchema), (req, res) => {
  const action = actions.find((a) => a.id === Number(req.params.id));
  if (!action) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  action.status = req.body.status;
  res.json(action);
});

export default router;
