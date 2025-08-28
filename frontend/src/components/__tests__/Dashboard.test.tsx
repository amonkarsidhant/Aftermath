import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { fetchTimelineEvents } from '../../api/timeline';
import { generatePostmortemNarrative } from '../../ai/narrative';

jest.mock('../IncidentsTab', () => () => <div>IncidentsTab</div>);
jest.mock('../ActionsTab', () => () => <div>ActionsTab</div>);
jest.mock('../MetricsTab', () => () => <div>MetricsTab</div>);
jest.mock('../TimelineTab', () => () => <div>TimelineTab</div>);
jest.mock('../CollaborationTab', () => () => <div>CollaborationTab</div>);
jest.mock('../ReviewAgenda', () => () => <div>ReviewAgenda</div>);
jest.mock('../RemediationActions', () => () => <div>RemediationActions</div>);

jest.mock('../../api/timeline');
jest.mock('../../ai/narrative');

describe('Dashboard', () => {
  it('navigates to Postmortems and shows details when a row is selected', async () => {
    (fetchTimelineEvents as jest.Mock).mockResolvedValue([]);
    (generatePostmortemNarrative as jest.Mock).mockResolvedValue({
      detection: '',
      escalation: '',
      mitigation: '',
      resolution: '',
    });

    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByText('Postmortems'));
    const row = await screen.findByText('Database outage');
    await user.click(row);

    expect(await screen.findByText('Incident ID: INC-001')).toBeInTheDocument();
  });
});
