export interface TimelineEvent {
  source: string;
  timestamp: string;
  description: string;
}

import { config } from '../utils/config';
import mockEvents from '../utils/mock/timeline.json';

export async function fetchTimelineEvents(
  start?: Date,
  end?: Date,
  providers?: string[]
): Promise<TimelineEvent[]> {
  if (config.useMockData) {
    let events = mockEvents as TimelineEvent[];
    if (start) events = events.filter((e) => new Date(e.timestamp) >= start);
    if (end) events = events.filter((e) => new Date(e.timestamp) <= end);
    if (providers && providers.length) {
      events = events.filter((e) => providers.includes(e.source));
    }
    return events;
  }

  const params = new URLSearchParams();
  if (start) params.set('start', start.toISOString());
  if (end) params.set('end', end.toISOString());
  if (providers && providers.length) params.set('providers', providers.join(','));

  const res = await fetch(`/timeline?${params.toString()}`);
  if (!res.ok) {
    let message = 'Failed to fetch timeline events';
    try {
      const err = await res.json();
      message = err.error || err.message || message;
    } catch {
      try {
        const text = await res.text();
        if (text) message = text;
      } catch {
        /* ignore */
      }
    }
    throw new Error(message);
  }
  const data = await res.json();
  return data.events as TimelineEvent[];
}
