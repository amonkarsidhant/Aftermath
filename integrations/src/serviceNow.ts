import { Integration, Incident, Action, ActionResponse, TimelineEvent } from './types';

export class ServiceNowIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.SERVICENOW_ENDPOINT ?? 'https://example.service-now.com';
    this.token = process.env.SERVICENOW_TOKEN ?? 'dummy-token';
  }

  async fetchIncident(id: string): Promise<Incident> {
    // Mock API call
    console.log(`ServiceNow fetchIncident called with id=${id} using ${this.endpoint}`);
    return { id, source: 'ServiceNow' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    // Mock API call
    console.log('ServiceNow createAction called with', item);
    return { success: true, message: 'ServiceNow action created' };
  }

  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    // Mock API call
    console.log(
      `ServiceNow fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using ${this.endpoint}`
    );
    return [
      {
        source: 'ServiceNow',
        timestamp: start.toISOString(),
        description: 'ServiceNow event',
      },
    ];
  }
}

