import type { Incident } from '../types';
import { config } from '../utils/config';
import mockIncidents from '../utils/mock/incidents.json';

export async function fetchIncidents(): Promise<Incident[]> {
  if (config.useMockData) {
    return mockIncidents as Incident[];
  }
  const res = await fetch('/incidents');
  if (!res.ok) {
    throw new Error('failed to fetch incidents');
  }
  const data = await res.json();
  return data.incidents as Incident[];
}
