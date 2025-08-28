import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import ActionStatusPieChart from '../ActionStatusPieChart';
import ActionList from '../ActionList';

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
});

