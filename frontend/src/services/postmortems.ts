import type { Postmortem } from '../types';
import { config } from '../utils/config';
import mockPostmortems from '../utils/mock/postmortems.json';

export async function searchPostmortems(q: string): Promise<Postmortem[]> {
  if (config.useMockData) {
    const normalized = q.toLowerCase();
    return (mockPostmortems as Postmortem[]).filter(
      (pm) =>
        pm.title.toLowerCase().includes(normalized) ||
        pm.summary.toLowerCase().includes(normalized) ||
        pm.tags.some((t) => t.toLowerCase().includes(normalized))
    );
  }
  const res = await fetch(`/postmortems/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('failed to search');
  const data = await res.json();
  return data.postmortems as Postmortem[];
}
