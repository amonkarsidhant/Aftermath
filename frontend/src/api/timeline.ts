export interface TimelineEvent {
  source: string;
  timestamp: string;
  description: string;
}

export async function fetchTimelineEvents(
  start?: Date,
  end?: Date,
  providers?: string[]
): Promise<TimelineEvent[]> {
  const params = new URLSearchParams();
  if (start) params.set('start', start.toISOString());
  if (end) params.set('end', end.toISOString());
  if (providers && providers.length) params.set('providers', providers.join(','));

  const res = await fetch(`/timeline?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch timeline events');
  }
  const data = await res.json();
  return data.events as TimelineEvent[];
}
