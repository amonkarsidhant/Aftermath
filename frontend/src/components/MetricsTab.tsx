import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { mttrData, type MTTRPoint } from '../utils/mock/metrics';

export function MTTRTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const { mttr, incidentCount } = payload[0].payload as MTTRPoint;
    return (
      <div className="bg-white p-2 border border-neutral-200 rounded shadow">
        MTTR: {mttr}h ({incidentCount} incidents)
      </div>
    );
  }
  return null;
}

export default function MetricsTab() {
  const formatMonth = (value: string) =>
    new Date(value + '-01').toLocaleString('default', { month: 'short' });

  return (
    <div className="w-full min-w-0 h-48 md:h-64 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <ResponsiveContainer>
        <LineChart data={mttrData}>
          <XAxis dataKey="date" tickFormatter={formatMonth} />
          <YAxis />
          <Tooltip content={<MTTRTooltip />} />
          <Line type="monotone" dataKey="mttr" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

