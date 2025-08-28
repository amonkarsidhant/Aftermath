import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate';
import { createAction, listActions, updateActionStatus } from '../models/action';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const actions = await listActions();
    res.json({ actions });
  } catch (err) {
    next(err);
  }
});

const actionSchema = z.object({
  postmortem_id: z.number(),
  description: z.string(),
  owner: z.string(),
  status: z.string(),
  due_date: z.string().optional(),
});

router.post('/', validate(actionSchema), async (req, res, next) => {
  try {
    const action = await createAction({
      postmortem_id: req.body.postmortem_id,
      description: req.body.description,
      owner: req.body.owner,
      status: req.body.status,
      due_date: req.body.due_date ? new Date(req.body.due_date) : undefined,
    });
    res.status(201).json(action);
  } catch (err) {
    next(err);
  }
});

const statusSchema = z.object({
  status: z.string(),
});

router.patch('/:id', validate(statusSchema), async (req, res, next) => {
  try {
    const action = await updateActionStatus(
      Number(req.params.id),
      req.body.status
    );
    if (!action) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(action);
  } catch (err) {
    next(err);
  }
});

export default router;
