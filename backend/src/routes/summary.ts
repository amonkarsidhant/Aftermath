import { Router } from 'express';
import { incidents } from '../storage';

const router = Router();

const msToHours = (ms: number): number => ms / (1000 * 60 * 60);

router.get('/', (_req, res) => {
  const now = Date.now();
  const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
  const recent = incidents.filter((i) => i.createdAt.getTime() >= ninetyDaysAgo);

  const sev1Count = recent.filter((i) => i.severity === 1).length;

  const mttrs = recent
    .filter((i) => i.resolvedAt)
    .map((i) => i.resolvedAt!.getTime() - i.createdAt.getTime());
  const avgMttrHours = mttrs.length
    ? msToHours(mttrs.reduce((a, b) => a + b, 0) / mttrs.length)
    : 0;

  const slaMet = recent.filter(
    (i) =>
      i.resolvedAt &&
      i.resolvedAt.getTime() - i.createdAt.getTime() <= i.slaHours * 60 * 60 * 1000
  ).length;
  const slaPercent = recent.length ? (slaMet / recent.length) * 100 : 0;

  res.json({ sev1Count, avgMttrHours, slaPercent });
});

export default router;
