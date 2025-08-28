import { useState } from 'react';
import IncidentsTab from '../components/IncidentsTab';
import ActionsTab from '../components/ActionsTab';
import MetricsTab from '../components/MetricsTab';
import PostmortemDetail from '../components/PostmortemDetail';
import PostmortemSearch from '../components/PostmortemSearch';
import type { Postmortem } from '../types';
import TimelineTab from '../components/TimelineTab';
import CollaborationTab from '../components/CollaborationTab';
import ReviewAgenda from '../components/ReviewAgenda';
import RemediationActions from '../components/RemediationActions';

const tabs = [
  'Incidents',
  'Postmortems',
  'Actions',
  'Metrics',
  'Timeline',
  'Collaboration',
  'Review',
] as const;
type Tab = typeof tabs[number];

export default function Dashboard() {
  const [active, setActive] = useState<Tab>('Incidents');
  const [selectedPostmortem, setSelectedPostmortem] =
    useState<Postmortem | null>(null);

  return (
    <div className="p-4">
      <nav className="border-b border-neutral-200 dark:border-neutral-700 mb-4 flex space-x-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 -mb-px transition-colors ${
              active === tab
                ? 'border-b-2 border-accent text-accent font-medium'
                : 'text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div>
        {active === 'Incidents' && <IncidentsTab />}
        {active === 'Postmortems' && (
          <div className="space-y-4">
            <PostmortemSearch onSelect={(pm) => setSelectedPostmortem(pm)} />
            {selectedPostmortem && (
              <PostmortemDetail postmortem={selectedPostmortem} />
            )}
          </div>
        )}
        {active === 'Actions' && <ActionsTab />}
        {active === 'Metrics' && <MetricsTab />}
        {active === 'Timeline' && <TimelineTab />}
        {active === 'Collaboration' && <CollaborationTab />}
        {active === 'Review' && (
          <div className="space-y-4">
            <ReviewAgenda />
            <RemediationActions />
          </div>
        )}
      </div>
    </div>
  );
}
