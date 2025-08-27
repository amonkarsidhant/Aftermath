import type { Plugin } from './index';
import type {
  Integration,
  Incident,
  Action,
  ActionResponse,
  TimelineEvent,
} from '../integrations/src/types';

class DatadogIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.DATADOG_ENDPOINT ?? 'https://api.datadoghq.com';
    this.token = process.env.DATADOG_TOKEN ?? 'dummy-token';
  }

  async fetchIncident(id: string): Promise<Incident> {
    console.log(`Datadog fetchIncident called with id=${id} using ${this.endpoint}`);
    return { id, source: 'Datadog' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    console.log('Datadog createAction called with', item);
    return { success: true, message: 'Datadog action created' };
  }

  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    console.log(
      `Datadog fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using ${this.endpoint}`
    );
    return [
      {
        source: 'Datadog',
        timestamp: start.toISOString(),
        description: 'Datadog event',
      },
    ];
  }
}

const datadogPlugin: Plugin = {
  name: 'datadog',
  register(registry) {
    if (process.env.DATADOG_TOKEN) {
      registry['datadog'] = new DatadogIntegration();
    }
  },
};

export default datadogPlugin;
