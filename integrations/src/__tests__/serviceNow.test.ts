import { ServiceNowIntegration } from '../serviceNow';

describe('ServiceNowIntegration', () => {
  let integration: ServiceNowIntegration;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    integration = new ServiceNowIntegration();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('fetchIncident returns expected incident and logs call', async () => {
    const result = await integration.fetchIncident('123');
    expect(result).toEqual({ id: '123', source: 'ServiceNow' });
    expect(logSpy).toHaveBeenCalledWith(
      'ServiceNow fetchIncident called with id=123 using https://example.service-now.com'
    );
  });

  it('createAction returns success and logs call', async () => {
    const action = { type: 'test-action' };
    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'ServiceNow action created' });
    expect(logSpy).toHaveBeenCalledWith('ServiceNow createAction called with', action);
  });

  it('fetchEvents returns timeline events and logs call', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const result = await integration.fetchEvents(start, end);
    expect(result).toEqual([
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
      },
    ]);
    expect(logSpy).toHaveBeenCalledWith(
      `ServiceNow fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using https://example.service-now.com`
    );
  });

  it('fetchEvents uses configured endpoint when provided', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    process.env.SERVICENOW_ENDPOINT = 'https://custom.servicenow';
    process.env.SERVICENOW_TOKEN = 'custom-token';
    const custom = new ServiceNowIntegration();
    await custom.fetchEvents(start, end);
    expect(logSpy).toHaveBeenCalledWith(
      `ServiceNow fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using https://custom.servicenow`
    );
    delete process.env.SERVICENOW_ENDPOINT;
    delete process.env.SERVICENOW_TOKEN;
  });
});
