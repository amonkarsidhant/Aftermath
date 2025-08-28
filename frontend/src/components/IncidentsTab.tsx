import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { incidents } from '../utils/mock/incidents';
import type { Incident } from '../types';

interface SeverityCount {
  severity: string;
  count: number;
}

const data: SeverityCount[] = incidents.reduce<SeverityCount[]>(
  (acc, incident: Incident) => {
    const found = acc.find((item) => item.severity === incident.severity);
    if (found) {
      found.count += 1;
    } else {
      acc.push({ severity: incident.severity, count: 1 });
    }
    return acc;
  },
  []
);

export default function IncidentsTab() {
  return (
    <div className="w-full h-64 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="severity" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

