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
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="status" fill="#82ca9d" label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

