export interface Incident {
  id: string;
  title?: string;
  [key: string]: any;
}

export interface Action {
  type: string;
  [key: string]: any;
}

export interface ActionResponse {
  success: boolean;
  message?: string;
  [key: string]: any;
}

export interface TimelineEvent {
  source: string;
  timestamp: string;
  description: string;
  category: 'human' | 'system';
  [key: string]: any;
}

export interface Integration {
  fetchIncident(id: string): Promise<Incident>;
  createAction(item: Action): Promise<ActionResponse>;
  fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]>;
}

