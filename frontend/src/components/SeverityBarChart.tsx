import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { incidents } from '../utils/mock/incidents';
import type { Incident } from '../types';
import { useMemo } from 'react';

interface Props {
  onSelectSeverity: (sev: string) => void;
}

interface SeverityCount {
  severity: string;
  count: number;
}

export default function SeverityBarChart({ onSelectSeverity }: Props) {
  const data = useMemo(() => {
    return incidents.reduce<SeverityCount[]>((acc, incident: Incident) => {
      const found = acc.find((item) => item.severity === incident.severity);
      if (found) {
        found.count += 1;
      } else {
        acc.push({ severity: incident.severity, count: 1 });
      }
      return acc;
    }, []);
  }, []);

  const colorMap: Record<string, string> = {
    'SEV-1': '#ef4444',
    'SEV-2': '#f97316',
    'SEV-3': '#facc15',
  };

  return (
    <div className="w-full min-w-0 h-48 md:h-64 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="severity" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count">
            {data.map((entry) => (
              <Cell
                key={entry.severity}
                cursor="pointer"
                fill={colorMap[entry.severity] || '#8884d8'}
                onClick={() => onSelectSeverity(entry.severity)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
