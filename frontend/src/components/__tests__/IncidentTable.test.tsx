import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncidentTable from '../IncidentTable';
import { useIncidents } from '../../services/api';
import mockIncidents from '../../utils/mock/incidents.json';

jest.mock('../../services/api', () => ({ useIncidents: jest.fn() }));

describe('IncidentTable', () => {
  beforeEach(() => {
    (useIncidents as jest.Mock).mockReturnValue({ data: mockIncidents });
  });

  it('renders all columns', () => {
    render(<IncidentTable />);
    ['ID', 'Service', 'Severity', 'Status', 'Date'].forEach((col) => {
      expect(screen.getByText(col)).toBeInTheDocument();
    });
  });

  it('filters by severity', async () => {
    const user = userEvent.setup();
    render(<IncidentTable />);
    await screen.findByText('Auth');
    await user.selectOptions(screen.getByLabelText('Severity'), 'SEV-2');
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).queryByText('SEV-1')).toBeNull();
  });

  it('searches by id', async () => {
    const user = userEvent.setup();
    render(<IncidentTable />);
    await screen.findByText('Auth');
    const search = screen.getByPlaceholderText('Search incidents');
    await user.type(search, '6');
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2);
    expect(within(table).getByText('6')).toBeInTheDocument();
  });
});

