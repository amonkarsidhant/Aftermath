import { render, screen } from '@testing-library/react';
import PostmortemDetail from '../PostmortemDetail';
import { fetchTimelineEvents } from '../../services/timeline';
import { generatePostmortemNarrative } from '../../services/ai/narrative';

jest.mock('../../services/timeline');
jest.mock('../../services/ai/narrative');

describe('PostmortemDetail', () => {
  it('renders error when timeline fetch fails', async () => {
    (fetchTimelineEvents as jest.Mock).mockRejectedValue(new Error('timeline failed'));
    (generatePostmortemNarrative as jest.Mock).mockResolvedValue(null);

    render(
      <PostmortemDetail
        postmortem={{ id: 1, title: 't', incidentId: '1', summary: 's', tags: [] }}
      />
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('timeline failed');
  });

  it('displays narrative when fetch succeeds', async () => {
    (fetchTimelineEvents as jest.Mock).mockResolvedValue([]);
    (generatePostmortemNarrative as jest.Mock).mockResolvedValue({
      detection: 'det',
      escalation: 'esc',
      mitigation: 'mit',
      resolution: 'res',
    });

    render(
      <PostmortemDetail
        postmortem={{ id: 1, title: 't', incidentId: '1', summary: 's', tags: [] }}
      />
    );

    expect(await screen.findByDisplayValue('det')).toBeInTheDocument();
  });
});
