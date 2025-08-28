import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import SeverityBarChart from '../SeverityBarChart';
import IncidentTable from '../IncidentTable';
import { fetchIncidents } from '../../services/incidents';
import mockIncidents from '../../utils/mock/incidents.json';

jest.mock('../../services/incidents');

function Wrapper() {
  const [severity, setSeverity] = useState<string | undefined>(undefined);
  return (
    <>
      <SeverityBarChart onSelectSeverity={setSeverity} />
      <IncidentTable severityFilter={severity} />
    </>
  );
}

describe('SeverityBarChart', () => {
  beforeEach(() => {
    (fetchIncidents as jest.Mock).mockResolvedValue(mockIncidents);
  });

  it('filters incidents when a bar is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Wrapper />);
    await waitFor(() => {
      expect(container.querySelectorAll('.recharts-bar-rectangle').length).toBeGreaterThan(0);
    });
    const bars = container.querySelectorAll('.recharts-bar-rectangle');
    const firstBar = bars[0].querySelector('path, rect') as HTMLElement;
    await user.click(firstBar);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).queryByText('SEV-2')).toBeNull();
  });
});
