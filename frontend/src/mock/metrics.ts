export interface MTTRPoint {
  date: string;
  mttr: number; // mean time to recovery in hours
}

export const mttrData: MTTRPoint[] = [
  { date: '2024-01', mttr: 5 },
  { date: '2024-02', mttr: 3 },
  { date: '2024-03', mttr: 4 },
  { date: '2024-04', mttr: 2 },
];

