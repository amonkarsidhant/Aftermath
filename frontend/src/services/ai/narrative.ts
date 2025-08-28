import { TimelineEvent } from '../timeline';

export interface Narrative {
  detection: string;
  escalation: string;
  mitigation: string;
  resolution: string;
}

export interface BlamelessNarrative {
  original: Narrative;
  blameless: Narrative;
}

function authHeader() {
  const key = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  return key ? { Authorization: `Bearer ${key}` } : {};
}

export async function generatePostmortemNarrative(
  events: TimelineEvent[],
): Promise<Narrative> {
  const timeline = events
    .map((e) => `${e.timestamp} ${e.source}: ${e.description}`)
    .join('\n');
  const prompt = `Given the following incident timeline, identify the detection, escalation, mitigation, and resolution phases and return a JSON object with keys detection, escalation, mitigation, resolution.\nTimeline:\n${timeline}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    throw new Error('LLM request failed');
  }
  const data = await res.json();
  const content = JSON.parse(data.choices[0].message.content);
  return {
    detection: content.detection || '',
    escalation: content.escalation || '',
    mitigation: content.mitigation || '',
    resolution: content.resolution || '',
  };
}

export async function rewriteBlameless(text: string): Promise<string> {
  const prompt = `Rewrite the following text in a blameless, objective tone:\n${text}`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error('LLM request failed');
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

export async function generateBlamelessNarrative(
  events: TimelineEvent[],
): Promise<BlamelessNarrative> {
  const original = await generatePostmortemNarrative(events);
  const entries = await Promise.all(
    (Object.keys(original) as (keyof Narrative)[]).map(async (k) => [
      k,
      await rewriteBlameless(original[k]),
    ]),
  );
  const blameless = Object.fromEntries(entries) as Narrative;
  return { original, blameless };
}
