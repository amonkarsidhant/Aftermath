import { Integration, Incident, Action, ActionResponse, TimelineEvent } from './types';

export class SlackIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.SLACK_ENDPOINT ?? 'https://slack.com/api';
    this.token = process.env.SLACK_TOKEN ?? 'dummy-token';
  }

  async fetchIncident(id: string): Promise<Incident> {
    // Mock API call
    console.log(`Slack fetchIncident called with id=${id} using ${this.endpoint}`);
    return { id, source: 'Slack' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    // Mock API call
    console.log('Slack createAction called with', item);
    return { success: true, message: 'Slack action created' };
  }

  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    // Mock API call
    console.log(
      `Slack fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using ${this.endpoint}`
    );
    return [
      {
        source: 'Slack',
        timestamp: start.toISOString(),
        description: 'Slack event',
      },
    ];
  }
}
