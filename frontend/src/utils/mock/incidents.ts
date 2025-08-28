import type { Incident } from '../../types';

export const incidents: Incident[] = [
  {
    id: 1,
    service: 'Auth',
    severity: 'SEV-1',
    status: 'Resolved',
    date: '2024-01-01',
  },
  {
    id: 2,
    service: 'Payments',
    severity: 'SEV-2',
    status: 'Open',
    date: '2024-01-15',
  },
  {
    id: 3,
    service: 'Search',
    severity: 'SEV-3',
    status: 'In Progress',
    date: '2024-02-10',
  },
  {
    id: 4,
    service: 'Auth',
    severity: 'SEV-3',
    status: 'Resolved',
    date: '2024-03-05',
  },
  {
    id: 5,
    service: 'Orders',
    severity: 'SEV-2',
    status: 'Open',
    date: '2024-04-20',
  },
  {
    id: 6,
    service: 'Payments',
    severity: 'SEV-1',
    status: 'Resolved',
    date: '2024-05-18',
  },
];

