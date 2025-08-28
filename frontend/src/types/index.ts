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
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

export interface Action {
  id: number;
  status: 'Open' | 'In Progress' | 'Completed';
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
