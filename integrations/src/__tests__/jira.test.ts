import nock from 'nock';
import { JiraIntegration } from '../jira';

describe('JiraIntegration', () => {
  let integration: JiraIntegration;

  beforeEach(() => {
    integration = new JiraIntegration();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetchIncident requests incident and returns data', async () => {
    const scope = nock('https://your-jira-instance.atlassian.net')
      .get('/incidents/789')
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { id: '789', source: 'Jira' });

    const result = await integration.fetchIncident('789');
    expect(result).toEqual({ id: '789', source: 'Jira' });
    expect(scope.isDone()).toBe(true);
  });

  it('createAction posts action and returns response', async () => {
    const action = { type: 'test-action' };
    const scope = nock('https://your-jira-instance.atlassian.net')
      .post('/actions', action)
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { success: true, message: 'Jira action created' });

    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'Jira action created' });
    expect(scope.isDone()).toBe(true);
  });

  it('fetchEvents retrieves events', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const events = [
      {
        source: 'Jira',
        timestamp: start.toISOString(),
        description: 'Jira event',
        responder: {
          id: 'jira-responder-1',
          name: 'Jira Responder',
          team: 'Engineering',
          role: 'Developer',
        },
      },
    ];
    const scope = nock('https://your-jira-instance.atlassian.net')
      .get('/events')
      .query({ start: start.toISOString(), end: end.toISOString() })
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, events);

    const result = await integration.fetchEvents(start, end);
    expect(result).toEqual(events);
    expect(scope.isDone()).toBe(true);
  });

  it('fetchEvents uses configured endpoint when provided', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    process.env.JIRA_ENDPOINT = 'https://custom-jira.example';
    process.env.JIRA_TOKEN = 'custom-token';
    const custom = new JiraIntegration();

    const scope = nock('https://custom-jira.example')
      .get('/events')
      .query({ start: start.toISOString(), end: end.toISOString() })
      .matchHeader('Authorization', 'Bearer custom-token')
      .reply(200, []);

    await custom.fetchEvents(start, end);
    expect(scope.isDone()).toBe(true);
    delete process.env.JIRA_ENDPOINT;
    delete process.env.JIRA_TOKEN;
  });

  it('pollActionStatus emits updates and persists them', async () => {
    const first = {
      fields: {
        status: { name: 'Open' },
        assignee: { displayName: 'Alice' },
      },
    };
    const second = {
      fields: {
        status: { name: 'In Progress' },
        assignee: { displayName: 'Bob' },
      },
    };

    const scope = nock('https://your-jira-instance.atlassian.net')
      .get('/issues/100')
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, first)
      .get('/issues/100')
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, second);

    const repo = { save: jest.fn().mockResolvedValue(undefined) };
    const polling = new JiraIntegration(repo as any, 10);
    const updates: any[] = [];

    for await (const update of polling.pollActionStatus('100')) {
      updates.push(update);
      if (updates.length === 2) break;
    }

    expect(updates).toEqual([
      { status: 'Open', assignee: 'Alice' },
      { status: 'In Progress', assignee: 'Bob' },
    ]);
    expect(repo.save).toHaveBeenCalledTimes(2);
    expect(scope.isDone()).toBe(true);
  });
});

