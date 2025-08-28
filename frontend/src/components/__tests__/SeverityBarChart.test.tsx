import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import SeverityBarChart from '../SeverityBarChart';
import IncidentTable from '../IncidentTable';
import { fetchIncidents } from '../../services/incidents';
import mockIncidents from '../../utils/mock/incidents.json';
import { exportElementToPDF, exportElementToPNG, exportToCSV } from '../../utils/export';

jest.mock('../../services/incidents');
jest.mock('../../utils/export', () => ({
  exportElementToPDF: jest.fn(),
  exportElementToPNG: jest.fn(),
  exportToCSV: jest.fn(),
}));

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

  it('exports chart', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SeverityBarChart onSelectSeverity={jest.fn()} />
    );
    await waitFor(() => {
      expect(container.querySelectorAll('.recharts-bar-rectangle').length).toBeGreaterThan(0);
    });
    await user.click(screen.getByRole('button', { name: /export pdf/i }));
    expect(exportElementToPDF).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /export png/i }));
    expect(exportElementToPNG).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /export csv/i }));
    expect(exportToCSV).toHaveBeenCalled();
  });
});
