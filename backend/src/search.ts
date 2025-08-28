import pool from './db';

export interface Postmortem {
  id: number;
  incidentId: string;
  title: string;
  summary: string;
  tags: string[];
}

const STOPWORDS = new Set(['incident', 'involving', 'the', 'a', 'an']);

export function parseQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

export async function searchPostmortems(query: string): Promise<Postmortem[]> {
  const keywords = parseQuery(query);
  const like = `%${keywords.join('%')}%`;
  const result = await pool.query(
    `SELECT id, incidentId, title, summary, tags FROM postmortems WHERE title ILIKE $1 OR summary ILIKE $1 OR tags ILIKE $1`,
    [like]
  );
  return result.rows.map((r) => ({
    id: r.id,
    incidentId: r.incidentid,
    title: r.title,
    summary: r.summary,
    tags: r.tags ? r.tags.split(',') : [],
  }));
}
