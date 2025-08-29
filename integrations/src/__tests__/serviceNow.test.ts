import nock from 'nock';
import { ServiceNowIntegration } from '../serviceNow';

describe('ServiceNowIntegration', () => {
  let integration: ServiceNowIntegration;

  beforeEach(() => {
    integration = new ServiceNowIntegration();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetchIncident requests incident and returns data', async () => {
    const scope = nock('https://example.service-now.com')
      .get('/incidents/123')
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { id: '123', source: 'ServiceNow' });

    const result = await integration.fetchIncident('123');
    expect(result).toEqual({ id: '123', source: 'ServiceNow' });
    expect(scope.isDone()).toBe(true);
  });

  it('createAction posts action and returns response', async () => {
    const action = { type: 'test-action' };
    const scope = nock('https://example.service-now.com')
      .post('/actions', action)
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { success: true, message: 'ServiceNow action created' });

    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'ServiceNow action created' });
    expect(scope.isDone()).toBe(true);
  });

  it('pushPostmortem posts summary and returns response', async () => {
    const summary = { summary: 'Postmortem details' };
    const scope = nock('https://example.service-now.com')
      .post('/incidents/123/postmortem', summary)
      .matchHeader('Authorization', 'Bearer dummy-token')
      .reply(200, { success: true, message: 'Postmortem recorded' });

    const result = await integration.pushPostmortem('123', summary);
    expect(result).toEqual({ success: true, message: 'Postmortem recorded' });
    expect(scope.isDone()).toBe(true);
  });

  it('pollActionStatus yields no updates', async () => {
    const iterator = integration.pollActionStatus('action');
    const { done } = await iterator.next();
    expect(done).toBe(true);
  });

  it('fetchEvents retrieves events', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const events = [
      {
        source: 'ServiceNow',
        timestamp: start.toISOString(),
        description: 'ServiceNow event',
        responder: {
          id: 'servicenow-responder-1',
          name: 'ServiceNow Responder',
          team: 'ITSM',
          role: 'Analyst',
        },
        category: 'system',
      },
    ];
    const scope = nock('https://example.service-now.com')
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
    process.env.SERVICENOW_ENDPOINT = 'https://custom.servicenow';
    process.env.SERVICENOW_TOKEN = 'custom-token';
    const custom = new ServiceNowIntegration();

    const scope = nock('https://custom.servicenow')
      .get('/events')
      .query({ start: start.toISOString(), end: end.toISOString() })
      .matchHeader('Authorization', 'Bearer custom-token')
      .reply(200, []);

    await custom.fetchEvents(start, end);
    expect(scope.isDone()).toBe(true);
    delete process.env.SERVICENOW_ENDPOINT;
    delete process.env.SERVICENOW_TOKEN;
  });
});

