import { PagerDutyIntegration } from '../pagerDuty';

describe('PagerDutyIntegration', () => {
  let integration: PagerDutyIntegration;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    integration = new PagerDutyIntegration();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('fetchIncident returns expected incident and logs call', async () => {
    const result = await integration.fetchIncident('456');
    expect(result).toEqual({ id: '456', source: 'PagerDuty' });
    expect(logSpy).toHaveBeenCalledWith(
      'PagerDuty fetchIncident called with id=456 using https://api.pagerduty.com'
    );
  });

  it('createAction returns success and logs call', async () => {
    const action = { type: 'test-action' };
    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'PagerDuty action created' });
    expect(logSpy).toHaveBeenCalledWith('PagerDuty createAction called with', action);
  });

  it('fetchEvents returns timeline events and logs call', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const result = await integration.fetchEvents(start, end);
    expect(result).toEqual([
      {
        source: 'PagerDuty',
        timestamp: start.toISOString(),
        description: 'PagerDuty event',
      },
    ]);
    expect(logSpy).toHaveBeenCalledWith(
      `PagerDuty fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using https://api.pagerduty.com`
    );
  });
});
