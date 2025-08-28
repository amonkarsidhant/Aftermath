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

export interface Postmortem {
  id: number;
  incidentId: string;
  title: string;
  summary: string;
  tags: string[];
}
