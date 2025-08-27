import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mttrData } from '../mock/metrics';

export default function MetricsTab() {
  return (
    <div className="w-full h-64">
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

