import axios from 'axios';
import {
  Integration,
  Incident,
  Action,
  ActionResponse,
  TimelineEvent,
  PostmortemSummary,
  ActionStatusUpdate,
  defaultPushPostmortem,
  defaultPollActionStatus,
} from './types';

export class SlackIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.SLACK_ENDPOINT ?? 'https://slack.com/api';
    this.token = process.env.SLACK_TOKEN ?? 'dummy-token';
  }

  pushPostmortem = defaultPushPostmortem;

  pollActionStatus = defaultPollActionStatus;

  async fetchIncident(id: string): Promise<Incident> {
    const { data } = await axios.get(`${this.endpoint}/incidents/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return data;
  }

  async createAction(item: Action): Promise<ActionResponse> {
    const { data } = await axios.post(`${this.endpoint}/actions`, item, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return data;
  }

  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    const { data } = await axios.get(`${this.endpoint}/events`, {
      headers: { Authorization: `Bearer ${this.token}` },
      params: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });
    return (data as TimelineEvent[]).map((e) => ({ ...e, category: 'human' }));
  }
}
