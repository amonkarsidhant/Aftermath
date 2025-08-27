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
});
