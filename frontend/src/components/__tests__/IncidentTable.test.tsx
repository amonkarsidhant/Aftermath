import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncidentTable from '../IncidentTable';
import { useIncidents } from '../../services/api';
import mockIncidents from '../../utils/mock/incidents.json';
import { exportElementToPDF, exportToCSV } from '../../utils/export';
import { getIncidentShareUrl } from '../../services/share';

jest.mock('../../services/api', () => ({ useIncidents: jest.fn() }));
jest.mock('../../utils/export', () => ({
  exportElementToPDF: jest.fn(),
  exportToCSV: jest.fn(),
}));
jest.mock('../../services/share', () => ({ getIncidentShareUrl: jest.fn() }));

describe('IncidentTable', () => {
  beforeEach(() => {
    (useIncidents as jest.Mock).mockReturnValue({
      data: mockIncidents,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
  });

  it('matches snapshot', () => {
    const { container } = render(<IncidentTable />);
    expect(container).toMatchSnapshot();
  });

  it('renders all columns', () => {
    render(<IncidentTable />);
    ['ID', 'Service', 'Severity', 'Status', 'Date', 'Share'].forEach((col) => {
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

  it('exports data', async () => {
    const user = userEvent.setup();
    render(<IncidentTable />);
    await screen.findByText('Auth');
    await user.click(screen.getByRole('button', { name: /export pdf/i }));
    expect(exportElementToPDF).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /export csv/i }));
    expect(exportToCSV).toHaveBeenCalled();
  });

  it('copies share link', async () => {
    const user = userEvent.setup();
    (getIncidentShareUrl as jest.Mock).mockResolvedValue('link');
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
    render(<IncidentTable />);
    await screen.findByText('Auth');
    const btn = screen.getAllByRole('button', { name: /share/i })[0];
    await user.click(btn);
    expect(getIncidentShareUrl).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('link');
  });
});

