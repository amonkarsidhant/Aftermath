import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { fetchTimelineEvents } from '../../services/timeline';
import { generatePostmortemNarrative } from '../../services/ai/narrative';
import { searchPostmortems } from '../../services/postmortems';
import type { Postmortem } from '../../types';

jest.mock('../../components/IncidentsTab', () => () => <div>IncidentsTab</div>);
jest.mock('../../components/ActionsTab', () => () => <div>ActionsTab</div>);
jest.mock('../../components/MetricsTab', () => () => <div>MetricsTab</div>);

jest.mock('../../services/timeline');
jest.mock('../../services/ai/narrative');
jest.mock('../../services/postmortems');

describe('Dashboard', () => {
  it('navigates to Postmortems and shows details when a row is selected', async () => {
    (fetchTimelineEvents as jest.Mock).mockResolvedValue([]);
    (generatePostmortemNarrative as jest.Mock).mockResolvedValue({
      detection: '',
      escalation: '',
      mitigation: '',
      resolution: '',
    });
    const mockResults: Postmortem[] = [
      {
        id: 1,
        title: 'Database outage',
        incidentId: 'INC-001',
        summary: '',
        tags: ['database'],
      },
    ];
    (searchPostmortems as jest.Mock).mockResolvedValue(mockResults);

    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByRole('button', { name: 'Postmortems' }));
    const row = await screen.findByText('Database outage');
    await user.click(row);

    expect(await screen.findByText('Incident ID: INC-001')).toBeInTheDocument();
  });
});
