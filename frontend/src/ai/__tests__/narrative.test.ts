import { generatePostmortemNarrative, rewriteBlameless, Narrative } from '../narrative';
import { TimelineEvent } from '../../api/timeline';

describe('narrative helpers', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    (fetch as jest.Mock).mockReset();
  });

  it('extracts phases from LLM response', async () => {
    const events: TimelineEvent[] = [
      {
        source: 'monitor',
        timestamp: '2024-01-01T00:00:00Z',
        description: 'Alert triggered',
      },
    ];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                detection: 'Alert triggered',
                escalation: 'On-call notified',
                mitigation: 'Restarted service',
                resolution: 'Issue resolved',
              }),
            },
          },
        ],
      }),
    });
    const result = await generatePostmortemNarrative(events);
    const expected: Narrative = {
      detection: 'Alert triggered',
      escalation: 'On-call notified',
      mitigation: 'Restarted service',
      resolution: 'Issue resolved',
    };
    expect(result).toEqual(expected);
    expect(fetch).toHaveBeenCalled();
  });

  it('rewrites text in blameless tone', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Rewritten text' } }],
      }),
    });
    const result = await rewriteBlameless('Original text');
    expect(result).toBe('Rewritten text');
    expect(fetch).toHaveBeenCalled();
  });
});
