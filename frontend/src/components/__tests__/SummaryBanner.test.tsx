import { render, screen, waitFor } from '@testing-library/react';
import SummaryBanner from '../SummaryBanner';
import { fetchSummary } from '../../services/summary';

jest.mock('../../services/summary');

describe('SummaryBanner', () => {
  it('renders summary metrics', async () => {
    (fetchSummary as jest.Mock).mockResolvedValue({
      sev1Count: 2,
      avgMttrHours: 5,
      slaPercent: 80,
    });

    render(<SummaryBanner />);

    await waitFor(() => {
      expect(screen.getByTestId('sev1-count')).toHaveTextContent('2');
      expect(screen.getByTestId('avg-mttr')).toHaveTextContent('5');
      expect(screen.getByTestId('sla-percent')).toHaveTextContent('80%');
    });
  });
});
