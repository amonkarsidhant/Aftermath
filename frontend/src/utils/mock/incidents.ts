export interface Incident {
  id: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export const incidents: Incident[] = [
  { id: 1, severity: 'Critical' },
  { id: 2, severity: 'High' },
  { id: 3, severity: 'Medium' },
  { id: 4, severity: 'Low' },
  { id: 5, severity: 'High' },
  { id: 6, severity: 'Critical' },
];

