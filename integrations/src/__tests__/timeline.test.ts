import { collectTimelineEvents } from '../timeline';
import { Integration, Incident, Action, ActionResponse, TimelineEvent } from '../types';

class MockIntegration implements Integration {
  constructor(private name: string, private offset: number) {}
  async fetchIncident(id: string): Promise<Incident> {
    return { id };
  }
  async createAction(item: Action): Promise<ActionResponse> {
    return { success: true };
  }
  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    return [
      {
        source: this.name,
        timestamp: new Date(start.getTime() + this.offset).toISOString(),
        description: `${this.name} event`,
      },
    ];
  }
}

describe('collectTimelineEvents', () => {
  it('aggregates and sorts events', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const a = new MockIntegration('A', 2000);
    const b = new MockIntegration('B', 1000);
    const events = await collectTimelineEvents(start, end, { a, b });
    expect(events).toEqual([
      {
        source: 'B',
        timestamp: new Date(start.getTime() + 1000).toISOString(),
        description: 'B event',
      },
      {
        source: 'A',
        timestamp: new Date(start.getTime() + 2000).toISOString(),
        description: 'A event',
      },
    ]);
  });
});
