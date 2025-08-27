import { Router } from 'express';
import { incidents, actions, postmortems } from '../storage';

const router = Router();

const msToHours = (ms: number): number => ms / (1000 * 60 * 60);

router.get('/', (_req, res) => {
  const totalIncidents = incidents.length;
  const incidentsWithPostmortems = incidents.filter((incident) =>
    postmortems.some((pm) => pm.incidentId === incident.id)
  );
  const percentPostmortemsCompleted = totalIncidents
    ? (incidentsWithPostmortems.length / totalIncidents) * 100
    : 0;

  const totalActions = actions.length;
  const closedActions = actions.filter((action) => action.status === 'closed');
  const percentActionsClosed = totalActions
    ? (closedActions.length / totalActions) * 100
    : 0;

  const timesToPostmortem = incidentsWithPostmortems.map((incident) => {
    const pm = postmortems.find((p) => p.incidentId === incident.id)!;
    return pm.completedAt.getTime() - incident.createdAt.getTime();
  });
  const avgTimeToPostmortem = timesToPostmortem.length
    ? timesToPostmortem.reduce((a, b) => a + b, 0) / timesToPostmortem.length
    : 0;

  const timesToCloseActions = closedActions.map(
    (action) => action.closedAt!.getTime() - action.createdAt.getTime()
  );
  const avgTimeToCloseActions = timesToCloseActions.length
    ? timesToCloseActions.reduce((a, b) => a + b, 0) / timesToCloseActions.length
    : 0;

  const teams = Array.from(new Set(incidents.map((i) => i.team)));
  const teamMetrics: Record<string, {
    percentPostmortemsCompleted: number;
    percentActionsClosed: number;
    avgTimeToPostmortemHours: number;
    avgTimeToCloseActionsHours: number;
  }> = {};

  teams.forEach((team) => {
    const teamIncidents = incidents.filter((i) => i.team === team);
    const teamActions = actions.filter((a) =>
      teamIncidents.some((incident) => incident.id === a.incidentId)
    );
    const teamIncidentsWithPostmortems = teamIncidents.filter((incident) =>
      postmortems.some((pm) => pm.incidentId === incident.id)
    );
    const teamClosedActions = teamActions.filter((a) => a.status === 'closed');
    const teamTimesToPostmortem = teamIncidentsWithPostmortems.map((incident) => {
      const pm = postmortems.find((p) => p.incidentId === incident.id)!;
      return pm.completedAt.getTime() - incident.createdAt.getTime();
    });
    const teamTimesToCloseActions = teamClosedActions.map(
      (a) => a.closedAt!.getTime() - a.createdAt.getTime()
    );

    teamMetrics[team] = {
      percentPostmortemsCompleted: teamIncidents.length
        ? (teamIncidentsWithPostmortems.length / teamIncidents.length) * 100
        : 0,
      percentActionsClosed: teamActions.length
        ? (teamClosedActions.length / teamActions.length) * 100
        : 0,
      avgTimeToPostmortemHours: teamTimesToPostmortem.length
        ? msToHours(
            teamTimesToPostmortem.reduce((a, b) => a + b, 0) /
              teamTimesToPostmortem.length
          )
        : 0,
      avgTimeToCloseActionsHours: teamTimesToCloseActions.length
        ? msToHours(
            teamTimesToCloseActions.reduce((a, b) => a + b, 0) /
              teamTimesToCloseActions.length
          )
        : 0
    };
  });

  res.json({
    metrics: {
      percentPostmortemsCompleted,
      percentActionsClosed,
      avgTimeToPostmortemHours: msToHours(avgTimeToPostmortem),
      avgTimeToCloseActionsHours: msToHours(avgTimeToCloseActions),
      teamMetrics
    }
  });
});

export default router;
