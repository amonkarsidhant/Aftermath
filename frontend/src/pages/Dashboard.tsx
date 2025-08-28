import { useState } from 'react';
import IncidentsTab from '../components/IncidentsTab';
import ActionsTab from '../components/ActionsTab';
import MetricsTab from '../components/MetricsTab';
import PostmortemDetail from '../components/PostmortemDetail';
import PostmortemSearch from '../components/PostmortemSearch';
import ThemeToggle from '../components/ThemeToggle';
import type { Postmortem } from '../types';
const tabs = [
  'Incidents',
  'Postmortems',
  'Actions',
  'Metrics',
] as const;
type Tab = typeof tabs[number];

export default function Dashboard() {
  const [active, setActive] = useState<Tab>('Incidents');
  const [selectedPostmortem, setSelectedPostmortem] =
    useState<Postmortem | null>(null);

  return (
    <div className="flex h-screen">
      <aside className="flex flex-col w-56 border-r bg-neutral-50 dark:bg-neutral-900">
        <div className="p-4 border-b">
          <ThemeToggle />
        </div>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-left transition-colors ${
              active === tab
                ? 'bg-accent/20 text-accent font-medium'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
            }`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </aside>
      <main className="flex-1 overflow-y-auto p-4">
        {active === 'Incidents' && (
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <IncidentsTab />
          </div>
        )}
        {active === 'Postmortems' && (
          <div className="max-w-screen-xl mx-auto space-y-4">
            <PostmortemSearch onSelect={(pm) => setSelectedPostmortem(pm)} />
            {selectedPostmortem && (
              <PostmortemDetail postmortem={selectedPostmortem} />
            )}
          </div>
        )}
        {active === 'Actions' && (
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ActionsTab />
          </div>
        )}
        {active === 'Metrics' && (
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricsTab />
          </div>
        )}
      </main>
    </div>
  );
}
