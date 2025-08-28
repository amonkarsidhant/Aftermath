import { db } from './db';

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

export function searchPostmortems(query: string): Promise<Postmortem[]> {
  const keywords = parseQuery(query);
  const like = `%${keywords.join('%')}%`;
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, incidentId, title, summary, tags FROM postmortems WHERE title LIKE ? OR summary LIKE ? OR tags LIKE ?`,
      [like, like, like],
      (err: Error | null, rows: any[]) => {
        if (err) return reject(err);
        const data = rows.map((r: any) => ({
          id: r.id,
          incidentId: r.incidentId,
          title: r.title,
          summary: r.summary,
          tags: r.tags ? r.tags.split(',') : [],
        }));
        resolve(data);
      }
    );
  });
}
