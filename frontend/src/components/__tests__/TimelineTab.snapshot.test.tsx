import { render, screen } from '@testing-library/react';
import TimelineTab from '../TimelineTab';
import { fetchTimelineEvents } from '../../services/timeline';

jest.mock('../../services/timeline');

describe('TimelineTab snapshot', () => {
  it('matches snapshot', async () => {
    (fetchTimelineEvents as jest.Mock).mockResolvedValue([
      {
        source: 'slack',
        timestamp: '2024-01-01T00:00:00Z',
        description: 'Slack event',
        category: 'human',
      },
      {
        source: 'pagerduty',
        timestamp: '2024-01-01T01:00:00Z',
        description: 'PagerDuty event',
        category: 'system',
      },
    ]);

    const { container } = render(<TimelineTab />);

    expect(await screen.findByText(/Slack event/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
