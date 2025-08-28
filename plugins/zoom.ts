import type { Plugin } from './index';
import type {
  Integration,
  Incident,
  Action,
  ActionResponse,
  TimelineEvent,
} from '../integrations/src/types';

class ZoomIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.ZOOM_ENDPOINT ?? 'https://api.zoom.us';
    this.token = process.env.ZOOM_TOKEN ?? 'dummy-token';
  }

  async fetchIncident(id: string): Promise<Incident> {
    console.log(`Zoom fetchIncident called with id=${id} using ${this.endpoint}`);
    return { id, source: 'Zoom' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    console.log('Zoom createAction called with', item);
    return { success: true, message: 'Zoom action created' };
  }

  async fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]> {
    console.log(
      `Zoom fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using ${this.endpoint}`
    );
    return [
      {
        source: 'Zoom',
        timestamp: start.toISOString(),
        description: 'Zoom event',
        category: 'human',
      },
    ];
  }
}

const zoomPlugin: Plugin = {
  name: 'zoom',
  register(registry) {
    if (process.env.ZOOM_TOKEN) {
      registry['zoom'] = new ZoomIntegration();
    }
  },
};

export default zoomPlugin;
