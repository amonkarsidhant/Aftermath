export async function requestShareToken(
  type: 'incident' | 'postmortem',
  id: number | string
): Promise<string> {
  const res = await fetch(`/share/${type}/${id}`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('failed to get share token');
  }
  const data = await res.json();
  return data.token as string;
}

export async function getIncidentShareUrl(id: number | string): Promise<string> {
  const token = await requestShareToken('incident', id);
  return `${window.location.origin}/incidents/${id}?token=${token}`;
}

export async function getPostmortemShareUrl(
  id: number | string
): Promise<string> {
  const token = await requestShareToken('postmortem', id);
  return `${window.location.origin}/postmortems/${id}?token=${token}`;
}

export function getShareTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

export async function fetchWithShare(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const token = getShareTokenFromUrl();
  const headers = token
    ? { ...(init.headers || {}), Authorization: `Bearer ${token}` }
    : init.headers;
  return fetch(input, { ...init, headers });
}
