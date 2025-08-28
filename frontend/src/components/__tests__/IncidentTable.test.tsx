import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncidentTable from '../IncidentTable';

describe('IncidentTable', () => {
  it('renders all columns', () => {
    render(<IncidentTable />);
    ['ID', 'Service', 'Severity', 'Status', 'Date'].forEach((col) => {
      expect(screen.getByText(col)).toBeInTheDocument();
    });
  });

  it('filters by severity', async () => {
    const user = userEvent.setup();
    render(<IncidentTable />);
    await user.selectOptions(screen.getByLabelText('Severity'), 'High');
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).queryByText('Critical')).toBeNull();
  });

  it('searches by id', async () => {
    const user = userEvent.setup();
    render(<IncidentTable />);
    const search = screen.getByPlaceholderText('Search incidents');
    await user.type(search, '6');
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2);
    expect(within(table).getByText('6')).toBeInTheDocument();
  });
});

