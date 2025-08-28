import { render, screen, fireEvent } from '@testing-library/react';
import PostmortemSearch from '../PostmortemSearch';
import { usePostmortems } from '../../services/api';
import type { Postmortem } from '../../types';

jest.mock('../../services/api', () => ({ usePostmortems: jest.fn() }));

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
    (usePostmortems as jest.Mock).mockReturnValue({
      data: mockResults,
      isLoading: false,
      isError: false,
      refetch: jest.fn().mockResolvedValue({ data: mockResults }),
    });
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
    (usePostmortems as jest.Mock).mockReturnValue({
      data: mockResults,
      isLoading: false,
      isError: false,
      refetch: jest.fn().mockResolvedValue({ data: mockResults }),
    });
    const onSelect = jest.fn();
    render(<PostmortemSearch onSelect={onSelect} />);
    const item = await screen.findByText('Database outage');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalled();
  });
});
