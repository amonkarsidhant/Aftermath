import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool();

const MS_IN_HOUR = 1000 * 60 * 60;

router.get('/', async (_req, res, next) => {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const { rows } = await pool.query<{
      severity: number;
      date_detected: Date;
      date_resolved: Date | null;
      sla_hours: number | null;
    }>(
      'SELECT severity, date_detected, date_resolved, sla_hours FROM incidents WHERE date_detected >= $1',
      [ninetyDaysAgo]
    );

    const sev1Count = rows.filter((r) => r.severity === 1).length;

    const mttrs = rows
      .filter((r) => r.date_resolved)
      .map((r) => r.date_resolved!.getTime() - r.date_detected.getTime());
    const avgMttrHours = mttrs.length
      ? mttrs.reduce((a, b) => a + b, 0) / mttrs.length / MS_IN_HOUR
      : 0;

    const slaMet = rows.filter(
      (r) =>
        r.date_resolved &&
        r.sla_hours !== null &&
        r.date_resolved.getTime() - r.date_detected.getTime() <=
          (r.sla_hours || 0) * MS_IN_HOUR
    ).length;
    const slaPercent = rows.length ? (slaMet / rows.length) * 100 : 0;

    res.json({ sev1Count, avgMttrHours, slaPercent });
  } catch (err) {
    next(err);
  }
});

export default router;
