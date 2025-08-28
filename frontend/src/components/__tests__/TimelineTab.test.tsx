import { render, screen } from '@testing-library/react';
import TimelineTab from '../TimelineTab';
import { fetchTimelineEvents } from '../../api/timeline';

jest.mock('../../api/timeline');

describe('TimelineTab', () => {
  it('renders error when fetch fails', async () => {
    (fetchTimelineEvents as jest.Mock).mockRejectedValue(new Error('failed to load'));

    render(<TimelineTab />);

    expect(await screen.findByRole('alert')).toHaveTextContent('failed to load');
  });
});
