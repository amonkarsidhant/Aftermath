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

  it('fetchEvents returns timeline events and logs call', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const result = await integration.fetchEvents(start, end);
    expect(result).toEqual([
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
    ]);
    expect(logSpy).toHaveBeenCalledWith(
      `Jira fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using https://your-jira-instance.atlassian.net`
    );
  });

  it('fetchEvents uses configured endpoint when provided', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    process.env.JIRA_ENDPOINT = 'https://custom-jira.example';
    process.env.JIRA_TOKEN = 'custom-token';
    const custom = new JiraIntegration();
    await custom.fetchEvents(start, end);
    expect(logSpy).toHaveBeenCalledWith(
      `Jira fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using https://custom-jira.example`
    );
    delete process.env.JIRA_ENDPOINT;
    delete process.env.JIRA_TOKEN;
  });
});
