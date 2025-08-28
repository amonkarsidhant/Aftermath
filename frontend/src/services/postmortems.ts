import type { Postmortem } from '../types';

export async function searchPostmortems(q: string): Promise<Postmortem[]> {
  const res = await fetch(`/postmortems/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('failed to search');
  const data = await res.json();
  return data.postmortems as Postmortem[];
}
