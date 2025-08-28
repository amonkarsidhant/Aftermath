export interface Incident {
  id: number;
  title: string;
  team: string;
  status: 'open' | 'closed';
  severity: 1 | 2 | 3 | 4;
  createdAt: Date;
  resolvedAt?: Date;
  slaHours: number;
}

export interface Postmortem {
  id: number;
  incidentId: number;
  summary: string;
  completedAt: Date;
  tags: string[];
}

export interface Action {
  id: number;
  incidentId: number;
  description: string;
  status: 'open' | 'closed';
  createdAt: Date;
  closedAt?: Date;
}

export const incidents: Incident[] = [
  {
    id: 1,
    title: 'Database outage',
    team: 'Database',
    status: 'closed',
    severity: 1,
    createdAt: new Date('2024-05-01T10:00:00Z'),
    resolvedAt: new Date('2024-05-01T12:00:00Z'),
    slaHours: 4
  },
  {
    id: 2,
    title: 'Network issue',
    team: 'Networking',
    status: 'open',
    severity: 2,
    createdAt: new Date('2024-05-03T12:00:00Z'),
    slaHours: 8
  }
];

export const postmortems: Postmortem[] = [
  {
    id: 1,
    incidentId: 1,
    summary: 'Resolved database outage',
    completedAt: new Date('2024-05-02T10:00:00Z'),
    tags: ['database', 'outage']
  },
  {
    id: 2,
    incidentId: 2,
    summary: 'Incident involving Kafka scaling',
    completedAt: new Date('2024-05-04T15:00:00Z'),
    tags: ['kafka', 'scaling']
  }
];

export const actions: Action[] = [
  {
    id: 1,
    incidentId: 1,
    description: 'Restart database service',
    status: 'closed',
    createdAt: new Date('2024-05-01T11:00:00Z'),
    closedAt: new Date('2024-05-01T12:00:00Z')
  },
  {
    id: 2,
    incidentId: 1,
    description: 'Update firewall rules',
    status: 'open',
    createdAt: new Date('2024-05-01T11:30:00Z')
  },
  {
    id: 3,
    incidentId: 2,
    description: 'Investigate network configuration',
    status: 'closed',
    createdAt: new Date('2024-05-03T12:30:00Z'),
    closedAt: new Date('2024-05-03T13:30:00Z')
  }
];
