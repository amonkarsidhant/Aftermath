import { Pool } from 'pg';

export interface Postmortem {
  id: number;
  incidentId: string;
  title: string;
  summary: string;
  tags: string[];
}

const pool = new Pool();

const STOPWORDS = new Set(['incident', 'involving', 'the', 'a', 'an']);

export function parseQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

export async function searchPostmortems(query: string): Promise<Postmortem[]> {
  const keywords = parseQuery(query);
  if (keywords.length === 0) {
    return [];
  }
  const like = `%${keywords.join('%')}%`;
  const result = await pool.query(
    `SELECT p.id, p.incident_id, i.title, p.summary
       FROM postmortems p
       JOIN incidents i ON p.incident_id = i.id
       WHERE p.summary ILIKE $1
          OR p.impact ILIKE $1
          OR p.root_cause ILIKE $1
          OR p.resolution ILIKE $1
          OR p.lessons ILIKE $1`,
    [like]
  );
  return result.rows.map((r) => ({
    id: r.id,
    incidentId: String(r.incident_id),
    title: r.title,
    summary: r.summary || '',
    tags: [],
  }));
}
