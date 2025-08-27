import { JiraIntegration } from '../jira';

describe('JiraIntegration', () => {
  let integration: JiraIntegration;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    integration = new JiraIntegration();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('fetchIncident returns expected incident and logs call', async () => {
    const result = await integration.fetchIncident('789');
    expect(result).toEqual({ id: '789', source: 'Jira' });
    expect(logSpy).toHaveBeenCalledWith(
      'Jira fetchIncident called with id=789 using https://your-jira-instance.atlassian.net'
    );
  });

  it('createAction returns success and logs call', async () => {
    const action = { type: 'test-action' };
    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'Jira action created' });
    expect(logSpy).toHaveBeenCalledWith('Jira createAction called with', action);
  });
});
