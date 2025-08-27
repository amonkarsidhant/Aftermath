import type { Plugin } from './index';
import type {
  Integration,
  Incident,
  Action,
  ActionResponse,
  TimelineEvent,
} from '../integrations/src/types';

class GrafanaIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.GRAFANA_ENDPOINT ?? 'https://grafana.com/api';
    this.token = process.env.GRAFANA_TOKEN ?? 'dummy-token';
  }

  async fetchIncident(id: string): Promise<Incident> {
    console.log(`Grafana fetchIncident called with id=${id} using ${this.endpoint}`);
    return { id, source: 'Grafana' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    console.log('Grafana createAction called with', item);
    return { success: true, message: 'Grafana action created' };
  }

  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    console.log(
      `Grafana fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using ${this.endpoint}`
    );
    return [
      {
        source: 'Grafana',
        timestamp: start.toISOString(),
        description: 'Grafana event',
      },
    ];
  }
}

const grafanaPlugin: Plugin = {
  name: 'grafana',
  register(registry) {
    if (process.env.GRAFANA_TOKEN) {
      registry['grafana'] = new GrafanaIntegration();
    }
  },
};

export default grafanaPlugin;
