import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mttrData } from '../utils/mock/metrics';

export default function MetricsTab() {
  return (
    <div className="w-full min-w-0 h-48 md:h-64 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <ResponsiveContainer>
        <LineChart data={mttrData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="mttr" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

