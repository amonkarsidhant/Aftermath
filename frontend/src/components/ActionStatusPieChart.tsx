import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { actions } from '../utils/mock/actions';
import type { Action } from '../types';
import { useMemo, useRef } from 'react';
import { exportElementToPDF, exportElementToPNG, exportToCSV } from '../utils/export';

interface Props {
  onSelectStatus: (status: string) => void;
}

interface StatusCount {
  status: string;
  value: number;
}

export default function ActionStatusPieChart({ onSelectStatus }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => {
    return actions.reduce<StatusCount[]>((acc, action: Action) => {
      const found = acc.find((item) => item.status === action.status);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ status: action.status, value: 1 });
      }
      return acc;
    }, []);
  }, []);

  const colorMap: Record<string, string> = {
    Open: '#3b82f6',
    'In Progress': '#fbbf24',
    Closed: '#4ade80',
  };

  return (
    <div className="w-full min-w-0 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() =>
            chartRef.current && exportElementToPDF(chartRef.current, 'actions.pdf')
          }
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={() =>
            chartRef.current && exportElementToPNG(chartRef.current, 'actions.png')
          }
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export PNG
        </button>
        <button
          onClick={() => exportToCSV(data, 'actions.csv')}
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export CSV
        </button>
      </div>
      <div ref={chartRef} className="h-48 md:h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="status" label>
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  cursor="pointer"
                  fill={colorMap[entry.status] || '#8884d8'}
                  onClick={() => onSelectStatus(entry.status)}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

