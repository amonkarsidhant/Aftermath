import type { Plugin } from './index';
import type {
  Integration,
  Incident,
  Action,
  ActionResponse,
  TimelineEvent,
} from '../integrations/src/types';

class SplunkIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.SPLUNK_ENDPOINT ?? 'https://splunk.example.com';
    this.token = process.env.SPLUNK_TOKEN ?? 'dummy-token';
  }

  async fetchIncident(id: string): Promise<Incident> {
    console.log(`Splunk fetchIncident called with id=${id} using ${this.endpoint}`);
    return { id, source: 'Splunk' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    console.log('Splunk createAction called with', item);
    return { success: true, message: 'Splunk action created' };
  }

  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    console.log(
      `Splunk fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using ${this.endpoint}`
    );
    return [
      {
        source: 'Splunk',
        timestamp: start.toISOString(),
        description: 'Splunk event',
        category: 'system',
      },
    ];
  }
}

const splunkPlugin: Plugin = {
  name: 'splunk',
  register(registry) {
    if (process.env.SPLUNK_TOKEN) {
      registry['splunk'] = new SplunkIntegration();
    }
  },
};

export default splunkPlugin;
