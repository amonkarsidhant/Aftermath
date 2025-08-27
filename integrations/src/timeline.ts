import { TimelineEvent, Integration } from './types';
import { createIntegrations } from './index';

export async function collectTimelineEvents(
  start: Date,
  end: Date,
  integrations: Record<string, Integration> = createIntegrations()
): Promise<TimelineEvent[]> {
  const events = await Promise.all(
    Object.values(integrations).map((integration) => integration.fetchEvents(start, end))
  );

  return events
    .flat()
    .sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
}
