import { SlackIntegration } from '../slack';

describe('SlackIntegration', () => {
  let integration: SlackIntegration;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    integration = new SlackIntegration();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('fetchIncident returns expected incident and logs call', async () => {
    const result = await integration.fetchIncident('999');
    expect(result).toEqual({ id: '999', source: 'Slack' });
    expect(logSpy).toHaveBeenCalledWith(
      'Slack fetchIncident called with id=999 using https://slack.com/api'
    );
  });

  it('createAction returns success and logs call', async () => {
    const action = { type: 'test-action' };
    const result = await integration.createAction(action);
    expect(result).toEqual({ success: true, message: 'Slack action created' });
    expect(logSpy).toHaveBeenCalledWith('Slack createAction called with', action);
  });

  it('fetchEvents returns timeline events and logs call', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    const result = await integration.fetchEvents(start, end);
    expect(result).toEqual([
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
    ]);
    expect(logSpy).toHaveBeenCalledWith(
      `Slack fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using https://slack.com/api`
    );
  });

  it('fetchEvents uses configured endpoint when provided', async () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-01-02T00:00:00Z');
    process.env.SLACK_ENDPOINT = 'https://custom.slack.api';
    process.env.SLACK_TOKEN = 'custom-token';
    const custom = new SlackIntegration();
    await custom.fetchEvents(start, end);
    expect(logSpy).toHaveBeenCalledWith(
      `Slack fetchEvents called with start=${start.toISOString()} end=${end.toISOString()} using https://custom.slack.api`
    );
    delete process.env.SLACK_ENDPOINT;
    delete process.env.SLACK_TOKEN;
  });
});
