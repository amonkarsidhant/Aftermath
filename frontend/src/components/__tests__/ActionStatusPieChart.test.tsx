import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import ActionStatusPieChart from '../ActionStatusPieChart';
import ActionList from '../ActionList';
import { exportElementToPDF, exportElementToPNG, exportToCSV } from '../../utils/export';

jest.mock('../../utils/export', () => ({
  exportElementToPDF: jest.fn(),
  exportElementToPNG: jest.fn(),
  exportToCSV: jest.fn(),
}));

function Wrapper() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  return (
    <>
      <ActionStatusPieChart onSelectStatus={setStatus} />
      <ActionList statusFilter={status} />
    </>
  );
}

describe('ActionStatusPieChart', () => {
  it('filters actions when a slice is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Wrapper />);
    const slices = container.querySelectorAll('.recharts-pie-sector');
    expect(slices.length).toBeGreaterThan(0);
    const firstSlice = slices[0].querySelector('path') as HTMLElement;
    await user.click(firstSlice);
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).queryByText(/In Progress/)).toBeNull();
    expect(within(list).queryByText(/Closed/)).toBeNull();
  });

  it('exports chart', async () => {
    const user = userEvent.setup();
    render(<ActionStatusPieChart onSelectStatus={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /export pdf/i }));
    expect(exportElementToPDF).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /export png/i }));
    expect(exportElementToPNG).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /export csv/i }));
    expect(exportToCSV).toHaveBeenCalled();
  });
});

