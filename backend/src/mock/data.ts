export interface Incident {
  id: number;
  title: string;
  service: string;
  severity: number;
  status: string;
  date_detected: Date;
  date_resolved: Date | null;
  sla_hours: number | null;
}

export interface Postmortem {
  id: number;
  incident_id: number;
  summary: string | null;
  impact: string | null;
  root_cause: string | null;
  resolution: string | null;
  timeline: any | null;
  lessons: string | null;
}

export interface Action {
  id: number;
  postmortem_id: number;
  description: string;
  owner: string;
  status: string;
  due_date: Date | null;
}

export const incidents: Incident[] = [
  {
    id: 1,
    title: 'Database outage',
    service: 'database',
    severity: 1,
    status: 'resolved',
    date_detected: new Date('2023-01-01T00:00:00Z'),
    date_resolved: new Date('2023-01-01T02:00:00Z'),
    sla_hours: 4,
  },
  {
    id: 2,
    title: 'API latency spike',
    service: 'api',
    severity: 2,
    status: 'open',
    date_detected: new Date('2023-02-01T00:00:00Z'),
    date_resolved: null,
    sla_hours: 2,
  },
];

export const postmortems: Postmortem[] = [
  {
    id: 1,
    incident_id: 1,
    summary: 'Outage caused by misconfiguration',
    impact: 'Service unavailable',
    root_cause: 'Incorrect settings',
    resolution: 'Reverted configuration',
    timeline: null,
    lessons: 'Improve change review',
  },
];

export const actions: Action[] = [
  {
    id: 1,
    postmortem_id: 1,
    description: 'Add config validation',
    owner: 'alice',
    status: 'open',
    due_date: null,
  },
];
