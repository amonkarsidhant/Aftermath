import nock from 'nock';
import { SlackIntegration } from '../slack';

describe('SlackIntegration', () => {
  let integration: SlackIntegration;

  beforeEach(() => {
    integration = new SlackIntegration();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetchIncident requests incident and returns data', async () => {
    const scope = nock('https://slack.com')
      .get('/api/incidents/999')
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { id: '999', source: 'Slack' });

    const result = await integration.fetchIncident('999');
    expect(result).toEqual({ id: '999', source: 'Slack' });
    expect(scope.isDone()).toBe(true);
  });

  it('createAction posts action and returns response', async () => {
    const action = { type: 'test-action' };
    const scope = nock('https://slack.com')
      .post('/api/actions', action)
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { success: true, message: 'Slack action created' });

    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'Slack action created' });
    expect(scope.isDone()).toBe(true);
  });

  it('fetchEvents retrieves events', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const events = [
      {
        source: 'Slack',
        timestamp: start.toISOString(),
        description: 'Slack event',
        responder: {
          id: 'slack-responder-1',
          name: 'Slack Responder',
          team: 'Support',
          role: 'Agent',
        },
      },
    ];
    const scope = nock('https://slack.com')
      .get('/api/events')
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
    process.env.SLACK_ENDPOINT = 'https://custom.slack.api';
    process.env.SLACK_TOKEN = 'custom-token';
    const custom = new SlackIntegration();

    const scope = nock('https://custom.slack.api')
      .get('/events')
      .query({ start: start.toISOString(), end: end.toISOString() })
      .matchHeader('Authorization', 'Bearer custom-token')
      .reply(200, []);

    await custom.fetchEvents(start, end);
    expect(scope.isDone()).toBe(true);
    delete process.env.SLACK_ENDPOINT;
    delete process.env.SLACK_TOKEN;
  });
});

