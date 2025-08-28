import { render, screen, fireEvent } from '@testing-library/react';
import PostmortemSearch from '../PostmortemSearch';
import { searchPostmortems } from '../../api/postmortems';

jest.mock('../../api/postmortems');

describe('PostmortemSearch', () => {
  it('renders results from search', async () => {
    (searchPostmortems as jest.Mock).mockResolvedValue([
      { id: 1, incidentId: 'INC-001', title: 'Database outage', summary: '', tags: ['database'] },
    ]);
    const onSelect = jest.fn();
    render(<PostmortemSearch onSelect={onSelect} />);
    expect(await screen.findByText('Database outage')).toBeInTheDocument();
  });

  it('calls onSelect when a result is clicked', async () => {
    (searchPostmortems as jest.Mock).mockResolvedValue([
      { id: 1, incidentId: 'INC-001', title: 'Database outage', summary: '', tags: ['database'] },
    ]);
    const onSelect = jest.fn();
    render(<PostmortemSearch onSelect={onSelect} />);
    const item = await screen.findByText('Database outage');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalled();
  });
});
