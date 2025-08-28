export interface Responder {
  id: string;
  name: string;
  team: string;
  role: string;
}

export interface IncidentResponse {
  incidentId: string;
  responderId: string;
  timestamp: string;
}

export interface Incident {
  id: number;
  service: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

export interface Action {
  id: number;
  status: 'Open' | 'In Progress' | 'Closed';
}

export interface Postmortem {
  id: number;
  incidentId: string;
  title: string;
  summary: string;
  tags: string[];
  impact?: string;
  rootCause?: string;
  resolution?: string;
  lessons?: string;
}

export interface Summary {
  sev1Count: number;
  avgMttrHours: number;
  slaPercent: number;
}
