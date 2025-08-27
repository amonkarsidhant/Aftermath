import { Integration, Incident, Action, ActionResponse } from './types';

export class PagerDutyIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.PAGERDUTY_ENDPOINT ?? 'https://api.pagerduty.com';
    this.token = process.env.PAGERDUTY_TOKEN ?? 'dummy-token';
  }

  async fetchIncident(id: string): Promise<Incident> {
    // Mock API call
    console.log(`PagerDuty fetchIncident called with id=${id} using ${this.endpoint}`);
    return { id, source: 'PagerDuty' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    // Mock API call
    console.log('PagerDuty createAction called with', item);
    return { success: true, message: 'PagerDuty action created' };
  }
}

