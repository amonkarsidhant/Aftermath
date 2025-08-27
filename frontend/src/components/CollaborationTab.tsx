import React from 'react';
import CollaborationGraph from './CollaborationGraph';
import {
  calculateHeavyResponders,
  calculateCrossTeamInteractions,
} from '../metrics/responders';
import { Responder, IncidentResponse } from '../types';

const mockResponders: Responder[] = [
  { id: 'r1', name: 'Alice', team: 'Ops', role: 'Engineer' },
  { id: 'r2', name: 'Bob', team: 'Dev', role: 'Engineer' },
  { id: 'r3', name: 'Carol', team: 'Ops', role: 'Manager' },
  { id: 'r4', name: 'Dave', team: 'QA', role: 'Tester' },
];

const mockResponses: IncidentResponse[] = [
  { incidentId: 'i1', responderId: 'r1', timestamp: '2024-01-01T00:00:00Z' },
  { incidentId: 'i1', responderId: 'r2', timestamp: '2024-01-01T00:05:00Z' },
  { incidentId: 'i1', responderId: 'r3', timestamp: '2024-01-01T00:10:00Z' },
  { incidentId: 'i2', responderId: 'r1', timestamp: '2024-02-01T00:00:00Z' },
  { incidentId: 'i2', responderId: 'r4', timestamp: '2024-02-01T00:05:00Z' },
  { incidentId: 'i3', responderId: 'r2', timestamp: '2024-03-01T00:00:00Z' },
  { incidentId: 'i3', responderId: 'r4', timestamp: '2024-03-01T00:05:00Z' },
];

export default function CollaborationTab() {
  const heavy = calculateHeavyResponders(mockResponses, mockResponders, 2);
  const interactions = calculateCrossTeamInteractions(
    mockResponses,
    mockResponders
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Heavy Responders</h2>
        <ul className="list-disc list-inside">
          {heavy.map((h) => (
            <li key={h.responder.id}>
              {h.responder.name} ({h.responder.team}) - {h.count} responses
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Collaboration Graph</h2>
        <CollaborationGraph
          responders={mockResponders}
          interactions={interactions}
        />
      </div>
    </div>
  );
}
