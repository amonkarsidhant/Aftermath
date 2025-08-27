export interface Incident {
  id: number;
  title: string;
  team: string;
  status: 'open' | 'closed';
  createdAt: Date;
}

export interface Postmortem {
  id: number;
  incidentId: number;
  summary: string;
  completedAt: Date;
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
    createdAt: new Date('2024-05-01T10:00:00Z')
  },
  {
    id: 2,
    title: 'Network issue',
    team: 'Networking',
    status: 'open',
    createdAt: new Date('2024-05-03T12:00:00Z')
  }
];

export const postmortems: Postmortem[] = [
  {
    id: 1,
    incidentId: 1,
    summary: 'Resolved database outage',
    completedAt: new Date('2024-05-02T10:00:00Z')
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
