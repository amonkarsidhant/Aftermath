export interface AgendaNotes {
  well: string;
  wrong: string;
  lucky: string;
}

export interface Remediation {
  id: string;
  provider: string;
  description: string;
  url: string;
}

const AGENDA_KEY = 'review_agenda';
const ACTIONS_KEY = 'remediation_actions';

export function loadAgenda(): AgendaNotes {
  const raw = localStorage.getItem(AGENDA_KEY);
  return raw ? JSON.parse(raw) : { well: '', wrong: '', lucky: '' };
}

export function saveAgenda(notes: AgendaNotes): void {
  localStorage.setItem(AGENDA_KEY, JSON.stringify(notes));
}

export function loadActions(): Remediation[] {
  const raw = localStorage.getItem(ACTIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveActions(actions: Remediation[]): void {
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
}

export async function createAction(
  description: string,
  provider: 'jira' | 'servicenow'
): Promise<Remediation> {
  const res = await fetch('/api/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, provider }),
  });
  const data = await res.json();
  const action: Remediation = {
    id: data.id,
    url: data.url,
    description,
    provider,
  };
  const actions = loadActions();
  actions.push(action);
  saveActions(actions);
  return action;
}
