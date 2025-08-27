import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import PostmortemDetail from '../PostmortemDetail';
import { fetchTimelineEvents } from '../../api/timeline';
import { generatePostmortemNarrative } from '../../ai/narrative';

jest.mock('../../api/timeline');
jest.mock('../../ai/narrative');

describe('PostmortemDetail', () => {
  it('renders error when timeline fetch fails', async () => {
    (fetchTimelineEvents as jest.Mock).mockRejectedValue(new Error('timeline failed'));
    (generatePostmortemNarrative as jest.Mock).mockResolvedValue(null);

    const container = document.createElement('div');
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <PostmortemDetail
          postmortem={{ title: 't', incidentId: '1', summary: 's' }}
        />
      );
    });
    expect(container.textContent).toContain('timeline failed');
    root.unmount();
  });
});
