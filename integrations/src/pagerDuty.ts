import axios from 'axios';
import { Integration, Incident, Action, ActionResponse, TimelineEvent } from './types';

export class PagerDutyIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.PAGERDUTY_ENDPOINT ?? 'https://api.pagerduty.com';
    this.token = process.env.PAGERDUTY_TOKEN ?? 'dummy-token';
  }

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
    const incidentId = process.env.PAGERDUTY_INCIDENT_ID ?? 'dummy-incident';
    const { data } = await axios.get(
      `${this.endpoint}/incidents/${incidentId}/timeline`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
        params: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      }
    );
    return (data as TimelineEvent[]).map((e) => ({ ...e, category: 'system' }));
  }
}

