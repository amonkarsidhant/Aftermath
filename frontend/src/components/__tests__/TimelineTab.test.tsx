import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import TimelineTab from '../TimelineTab';
import { fetchTimelineEvents } from '../../api/timeline';

jest.mock('../../api/timeline');

describe('TimelineTab', () => {
  it('renders error when fetch fails', async () => {
    (fetchTimelineEvents as jest.Mock).mockRejectedValue(new Error('failed to load'));
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(async () => {
      root.render(<TimelineTab />);
    });
    expect(container.textContent).toContain('failed to load');
    root.unmount();
  });
});
