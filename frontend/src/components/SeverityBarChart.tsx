import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Incident } from '../types';
import { useEffect, useMemo, useState, useRef } from 'react';
import { fetchIncidents } from '../services/incidents';
import { exportElementToPDF, exportElementToPNG, exportToCSV } from '../utils/export';

interface Props {
  onSelectSeverity: (sev: string) => void;
}

interface SeverityCount {
  severity: string;
  count: number;
}

export default function SeverityBarChart({ onSelectSeverity }: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchIncidents().then(setIncidents).catch(() => setIncidents([]));
  }, []);

  const data = useMemo(() => {
    return incidents.reduce<SeverityCount[]>((acc, incident) => {
      const found = acc.find((item) => item.severity === incident.severity);
      if (found) {
        found.count += 1;
      } else {
        acc.push({ severity: incident.severity, count: 1 });
      }
      return acc;
    }, []);
  }, [incidents]);

  const colorMap: Record<string, string> = {
    'SEV-1': '#ef4444',
    'SEV-2': '#f97316',
    'SEV-3': '#facc15',
  };

  return (
    <div className="w-full min-w-0 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() =>
            chartRef.current && exportElementToPDF(chartRef.current, 'severity.pdf')
          }
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={() =>
            chartRef.current && exportElementToPNG(chartRef.current, 'severity.png')
          }
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export PNG
        </button>
        <button
          onClick={() => exportToCSV(data, 'severity.csv')}
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export CSV
        </button>
      </div>
      <div ref={chartRef} className="h-48 md:h-64">
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
    </div>
  );
}
