import { actions } from '../utils/mock/actions';
import type { Action } from '../types';

interface Props {
  statusFilter?: string;
}

export default function ActionList({ statusFilter }: Props) {
  const filtered = statusFilter
    ? actions.filter((a: Action) => a.status === statusFilter)
    : actions;

  return (
    <div className="w-full min-w-0 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
      <ul>
        {filtered.map((action) => (
          <li key={action.id}>{`Action ${action.id} - ${action.status}`}</li>
        ))}
      </ul>
    </div>
  );
}

