import { render } from '@testing-library/react';
import MetricsTab from '../MetricsTab';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));

describe('MetricsTab snapshot', () => {
  it('matches snapshot', () => {
    const { container } = render(<MetricsTab />);
    expect(container).toMatchSnapshot();
  });
});
