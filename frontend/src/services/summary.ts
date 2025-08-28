import type { Summary } from '../types';
import { config } from '../utils/config';
import mockSummary from '../utils/mock/summary';

export async function fetchSummary(): Promise<Summary> {
  if (config.useMockData) {
    return mockSummary;
  }
  const res = await fetch('/summary');
  if (!res.ok) {
    throw new Error('failed to fetch summary');
  }
  return (await res.json()) as Summary;
}
