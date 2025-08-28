import { render, screen, fireEvent } from '@testing-library/react';
import PostmortemSearch from '../PostmortemSearch';
import { searchPostmortems } from '../../services/postmortems';
import type { Postmortem } from '../../types';

jest.mock('../../services/postmortems');

describe('PostmortemSearch', () => {
  it('renders results from search', async () => {
    const mockResults: Postmortem[] = [
      {
        id: 1,
        incidentId: 'INC-001',
        title: 'Database outage',
        summary: '',
        tags: ['database'],
      },
    ];
    (searchPostmortems as jest.Mock).mockResolvedValue(mockResults);
    const onSelect = jest.fn();
    render(<PostmortemSearch onSelect={onSelect} />);
    expect(await screen.findByText('Database outage')).toBeInTheDocument();
  });

  it('calls onSelect when a result is clicked', async () => {
    const mockResults: Postmortem[] = [
      {
        id: 1,
        incidentId: 'INC-001',
        title: 'Database outage',
        summary: '',
        tags: ['database'],
      },
    ];
    (searchPostmortems as jest.Mock).mockResolvedValue(mockResults);
    const onSelect = jest.fn();
    render(<PostmortemSearch onSelect={onSelect} />);
    const item = await screen.findByText('Database outage');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalled();
  });
});
