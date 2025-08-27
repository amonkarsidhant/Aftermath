import { Responder, IncidentResponse } from '../types';

export interface HeavyResponderStat {
  responder: Responder;
  count: number;
}

export interface ResponderInteraction {
  source: string; // responderId
  target: string; // responderId
  count: number;
}

export function calculateHeavyResponders(
  responses: IncidentResponse[],
  responders: Responder[],
  threshold = 5
): HeavyResponderStat[] {
  const responderMap = new Map(responders.map((r) => [r.id, r]));
  const counts = new Map<string, number>();

  responses.forEach((r) => {
    counts.set(r.responderId, (counts.get(r.responderId) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .filter(([, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ responder: responderMap.get(id)!, count }));
}

export function calculateCrossTeamInteractions(
  responses: IncidentResponse[],
  responders: Responder[]
): ResponderInteraction[] {
  const responderMap = new Map(responders.map((r) => [r.id, r]));
  const incidents = new Map<string, Set<string>>();

  responses.forEach((r) => {
    if (!incidents.has(r.incidentId)) {
      incidents.set(r.incidentId, new Set());
    }
    incidents.get(r.incidentId)!.add(r.responderId);
  });

  const interactionCounts = new Map<string, number>();

  incidents.forEach((responderIds) => {
    const ids = Array.from(responderIds);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = responderMap.get(ids[i]);
        const b = responderMap.get(ids[j]);
        if (!a || !b || a.team === b.team) continue;
        const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
        interactionCounts.set(key, (interactionCounts.get(key) ?? 0) + 1);
      }
    }
  });

  return Array.from(interactionCounts.entries()).map(([key, count]) => {
    const [source, target] = key.split('|');
    return { source, target, count };
  });
}
