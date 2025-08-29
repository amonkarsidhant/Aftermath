import axios from 'axios';
import {
  Integration,
  Incident,
  Action,
  ActionResponse,
  TimelineEvent,
  ActionStatusUpdate,
  PostmortemSummary,
  defaultPushPostmortem,
} from './types';
import { ActionStatusRepository, defaultStatusRepository } from './statusRepository';

export class JiraIntegration implements Integration {
  private endpoint: string;
  private token: string;
  private pollInterval: number;
  private statusRepo: ActionStatusRepository;

  constructor(
    statusRepo: ActionStatusRepository = defaultStatusRepository,
    pollInterval = 5000,
  ) {
    this.endpoint = process.env.JIRA_ENDPOINT ?? 'https://your-jira-instance.atlassian.net';
    this.token = process.env.JIRA_TOKEN ?? 'dummy-token';
    this.statusRepo = statusRepo;
    this.pollInterval = pollInterval;
  }

  pushPostmortem = defaultPushPostmortem;

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
    return data;
  }

  async *pollActionStatus(id: string): AsyncGenerator<ActionStatusUpdate> {
    let lastStatus: string | null = null;
    let lastAssignee: string | null = null;

    while (true) {
      const { data } = await axios.get(`${this.endpoint}/issues/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const status = data?.fields?.status?.name ?? data.status;
      const assignee = data?.fields?.assignee?.displayName ?? data.assignee ?? null;

      if (status !== lastStatus || assignee !== lastAssignee) {
        lastStatus = status;
        lastAssignee = assignee;
        await this.statusRepo.save({ id, status, assignee });
        yield { status, assignee };
      }

      await new Promise((resolve) => setTimeout(resolve, this.pollInterval));
    }
  }
}

