export interface MTTRPoint {
  date: string;
  mttr: number; // mean time to recovery in hours
  incidentCount: number;
}

export const mttrData: MTTRPoint[] = [
  { date: '2024-01', mttr: 5, incidentCount: 4 },
  { date: '2024-02', mttr: 3, incidentCount: 2 },
  { date: '2024-03', mttr: 4, incidentCount: 3 },
  { date: '2024-04', mttr: 2, incidentCount: 1 },
];

