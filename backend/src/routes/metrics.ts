import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool();

const MS_IN_HOUR = 1000 * 60 * 60;

router.get('/', async (_req, res, next) => {
  try {
    // Fetch incidents with detection time, resolution time and SLA hours
    const incidentResult = await pool.query<{
      id: number;
      date_detected: Date;
      date_resolved: Date | null;
      sla_hours: number | null;
    }>(
      'SELECT id, date_detected, date_resolved, sla_hours FROM incidents'
    );
    const incidents = incidentResult.rows;

    // Calculate MTTR for each resolved incident
    const mttrPerIncident = incidents
      .filter((i) => i.date_resolved)
      .map((i) => ({
        incidentId: i.id,
        mttrHours:
          (i.date_resolved!.getTime() - i.date_detected.getTime()) /
          MS_IN_HOUR,
      }));

    const avgMttrHours = mttrPerIncident.length
      ? mttrPerIncident.reduce((sum, i) => sum + i.mttrHours, 0) /
        mttrPerIncident.length
      : 0;

    // SLA compliance calculation
    const slaMet = incidents.filter(
      (i) =>
        i.date_resolved &&
        i.sla_hours !== null &&
        i.date_resolved.getTime() - i.date_detected.getTime() <=
          (i.sla_hours || 0) * MS_IN_HOUR
    ).length;
    const slaCompliance = incidents.length
      ? (slaMet / incidents.length) * 100
      : 0;

    // Count of open actions
    const actionsResult = await pool.query<{ count: string }>(
      "SELECT COUNT(*) FROM actions WHERE status <> 'closed'"
    );
    const openActions = parseInt(actionsResult.rows[0].count, 10);

    res.json({
      mttrPerIncident,
      avgMttrHours,
      slaCompliance,
      openActions,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

