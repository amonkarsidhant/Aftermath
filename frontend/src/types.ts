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
