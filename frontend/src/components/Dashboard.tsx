import { useState } from 'react';
import IncidentsTab from './IncidentsTab';
import ActionsTab from './ActionsTab';
import MetricsTab from './MetricsTab';
import PostmortemDetail from './PostmortemDetail';

const tabs = ['Incidents', 'Postmortems', 'Actions', 'Metrics'] as const;
type Tab = typeof tabs[number];

export default function Dashboard() {
  const [active, setActive] = useState<Tab>('Incidents');

  return (
    <div className="p-4">
      <nav className="border-b mb-4 flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${active === tab ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div>
        {active === 'Incidents' && <IncidentsTab />}
        {active === 'Postmortems' && (
          <PostmortemDetail
            postmortem={{
              title: 'Database outage',
              incidentId: 'INC-001',
              summary: 'Root cause and remediation details for the outage.',
            }}
          />
        )}
        {active === 'Actions' && <ActionsTab />}
        {active === 'Metrics' && <MetricsTab />}
      </div>
    </div>
  );
}
