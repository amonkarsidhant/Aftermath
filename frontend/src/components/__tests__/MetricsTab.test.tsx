import { render, screen } from '@testing-library/react';
import { MTTRTooltip } from '../MetricsTab';

describe('MetricsTab tooltip', () => {
  it('renders MTTR value and incident count', () => {
    const payload = [{ payload: { mttr: 5, incidentCount: 2, date: '2024-01' } }];
    render(<MTTRTooltip active payload={payload} />);
    expect(screen.getByText('MTTR: 5h (2 incidents)')).toBeInTheDocument();
  });
});
