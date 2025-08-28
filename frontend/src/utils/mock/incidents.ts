import type { Incident } from '../../types';

export const incidents: Incident[] = [
  {
    id: 1,
    service: 'Auth',
    severity: 'Critical',
    status: 'Resolved',
    date: '2024-01-01',
  },
  {
    id: 2,
    service: 'Payments',
    severity: 'High',
    status: 'Open',
    date: '2024-01-15',
  },
  {
    id: 3,
    service: 'Search',
    severity: 'Medium',
    status: 'In Progress',
    date: '2024-02-10',
  },
  {
    id: 4,
    service: 'Auth',
    severity: 'Low',
    status: 'Resolved',
    date: '2024-03-05',
  },
  {
    id: 5,
    service: 'Orders',
    severity: 'High',
    status: 'Open',
    date: '2024-04-20',
  },
  {
    id: 6,
    service: 'Payments',
    severity: 'Critical',
    status: 'Resolved',
    date: '2024-05-18',
  },
];

