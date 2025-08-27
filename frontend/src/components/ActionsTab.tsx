import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { actions } from '../mock/actions';

interface StatusCount {
  status: string;
  value: number;
}

const data: StatusCount[] = actions.reduce<StatusCount[]>((acc, action) => {
  const found = acc.find((item) => item.status === action.status);
  if (found) {
    found.value += 1;
  } else {
    acc.push({ status: action.status, value: 1 });
  }
  return acc;
}, []);

export default function ActionsTab() {
  return (
    <div className="w-full h-64 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="status" fill="#82ca9d" label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

