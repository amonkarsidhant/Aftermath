import { Router } from 'express';
import { incidents, actions } from './data';

const router = Router();

const MS_IN_HOUR = 1000 * 60 * 60;

router.get('/', (_req, res) => {
  const mttrPerIncident = incidents
    .filter((i) => i.date_resolved)
    .map((i) => ({
      incidentId: i.id,
      mttrHours:
        (i.date_resolved!.getTime() - i.date_detected.getTime()) / MS_IN_HOUR,
    }));

  const avgMttrHours = mttrPerIncident.length
    ? mttrPerIncident.reduce((sum, i) => sum + i.mttrHours, 0) /
      mttrPerIncident.length
    : 0;

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

  const openActions = actions.filter((a) => a.status !== 'closed').length;

  res.json({
    mttrPerIncident,
    avgMttrHours,
    slaCompliance,
    openActions,
  });
});

export default router;
