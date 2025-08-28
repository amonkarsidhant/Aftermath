import { render, screen, fireEvent } from '@testing-library/react';
import TimelineTab from '../TimelineTab';
import { fetchTimelineEvents } from '../../services/timeline';

jest.mock('../../services/timeline');

describe('TimelineTab', () => {
  it('renders error when fetch fails', async () => {
    (fetchTimelineEvents as jest.Mock).mockRejectedValue(new Error('failed to load'));

    render(<TimelineTab />);

    expect(await screen.findByRole('alert')).toHaveTextContent('failed to load');
  });

  it('filters events by category', async () => {
    (fetchTimelineEvents as jest.Mock).mockResolvedValue([
      { source: 'slack', timestamp: '2024-01-01T00:00:00Z', description: 'human event', category: 'human' },
      { source: 'pagerduty', timestamp: '2024-01-01T01:00:00Z', description: 'system event', category: 'system' },
    ]);

    render(<TimelineTab />);

    expect(await screen.findByText(/human event/)).toBeInTheDocument();
    expect(screen.getByText(/system event/)).toBeInTheDocument();

    const systemCheckbox = screen.getByLabelText('System');
    fireEvent.click(systemCheckbox);

    expect(screen.queryByText(/system event/)).not.toBeInTheDocument();
    expect(screen.getByText(/human event/)).toBeInTheDocument();
  });
});
