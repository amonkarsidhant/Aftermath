import nock from 'nock';
import { PagerDutyIntegration } from '../pagerDuty';

describe('PagerDutyIntegration', () => {
  let integration: PagerDutyIntegration;

  beforeEach(() => {
    integration = new PagerDutyIntegration();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetchIncident requests incident and returns data', async () => {
    const scope = nock('https://api.pagerduty.com')
      .get('/incidents/456')
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { id: '456', source: 'PagerDuty' });

    const result = await integration.fetchIncident('456');
    expect(result).toEqual({ id: '456', source: 'PagerDuty' });
    expect(scope.isDone()).toBe(true);
  });

  it('createAction posts action and returns response', async () => {
    const action = { type: 'test-action' };
    const scope = nock('https://api.pagerduty.com')
      .post('/actions', action)
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { success: true, message: 'PagerDuty action created' });

    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'PagerDuty action created' });
    expect(scope.isDone()).toBe(true);
  });

  it('fetchEvents retrieves events', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const events = [
      {
        source: 'PagerDuty',
        timestamp: start.toISOString(),
        description: 'PagerDuty event',
        responder: {
          id: 'pagerduty-responder-1',
          name: 'PagerDuty Responder',
          team: 'OnCall',
          role: 'Responder',
        },
      },
    ];
    const scope = nock('https://api.pagerduty.com')
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
    process.env.PAGERDUTY_ENDPOINT = 'https://custom.pagerduty';
    process.env.PAGERDUTY_TOKEN = 'custom-token';
    const custom = new PagerDutyIntegration();

    const scope = nock('https://custom.pagerduty')
      .get('/events')
      .query({ start: start.toISOString(), end: end.toISOString() })
      .matchHeader('Authorization', 'Bearer custom-token')
      .reply(200, []);

    await custom.fetchEvents(start, end);
    expect(scope.isDone()).toBe(true);
    delete process.env.PAGERDUTY_ENDPOINT;
    delete process.env.PAGERDUTY_TOKEN;
  });
});

