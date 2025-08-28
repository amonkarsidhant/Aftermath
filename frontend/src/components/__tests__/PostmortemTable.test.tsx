import { render, screen, fireEvent } from '@testing-library/react';
import PostmortemTable from '../PostmortemTable';

describe('PostmortemTable', () => {
  it('renders mock postmortems', () => {
    const onSelect = jest.fn();
    render(<PostmortemTable onSelect={onSelect} />);
    expect(screen.getByText('Database outage')).toBeInTheDocument();
    expect(screen.getByText('API latency spike')).toBeInTheDocument();
  });

  it('calls onSelect when a row is clicked', () => {
    const onSelect = jest.fn();
    render(<PostmortemTable onSelect={onSelect} />);
    const rowText = screen.getByText('Database outage');
    fireEvent.click(rowText.closest('tr')!);
    expect(onSelect).toHaveBeenCalled();
  });
});
