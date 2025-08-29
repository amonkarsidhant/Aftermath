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

export interface PostmortemSummary {
  summary: string;
  [key: string]: any;
}

export interface Responder {
  id: string;
  name: string;
  team: string;
  role: string;
}

export interface TimelineEvent {
  source: string;
  timestamp: string;
  description: string;
  category: 'human' | 'system';
  responder?: Responder;
  escalationChain?: Responder[];
  [key: string]: any;
}

export interface ActionStatusUpdate {
  status: string;
  assignee?: string | null;
}

export interface Integration {
  fetchIncident(id: string): Promise<Incident>;
  createAction(item: Action): Promise<ActionResponse>;
  fetchEvents(start: Date, end: Date): Promise<TimelineEvent[]>;
  pushPostmortem?(id: string, summary: PostmortemSummary): Promise<ActionResponse>;
  pollActionStatus?(id: string): AsyncGenerator<ActionStatusUpdate>;
}

