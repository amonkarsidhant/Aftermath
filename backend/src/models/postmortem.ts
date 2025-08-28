import { Pool } from 'pg';

const pool = new Pool();

export interface Postmortem {
  id: number;
  incident_id: number;
  summary: string | null;
  impact: string | null;
  root_cause: string | null;
  resolution: string | null;
  timeline: any | null;
  lessons: string | null;
}

export interface PostmortemInput {
  incident_id: number;
  summary?: string;
  impact?: string;
  root_cause?: string;
  resolution?: string;
  timeline?: any;
  lessons?: string;
}

export async function createPostmortem(data: PostmortemInput): Promise<Postmortem> {
  const result = await pool.query<Postmortem>(
    `INSERT INTO postmortems (incident_id, summary, impact, root_cause, resolution, timeline, lessons)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, incident_id, summary, impact, root_cause, resolution, timeline, lessons`,
    [
      data.incident_id,
      data.summary || null,
      data.impact || null,
      data.root_cause || null,
      data.resolution || null,
      data.timeline || null,
      data.lessons || null,
    ]
  );
  return result.rows[0];
}

export async function getPostmortem(id: number): Promise<Postmortem | null> {
  const result = await pool.query<Postmortem>(
    `SELECT id, incident_id, summary, impact, root_cause, resolution, timeline, lessons FROM postmortems WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updatePostmortem(
  id: number,
  data: Partial<PostmortemInput>
): Promise<Postmortem | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx++;
  }

  if (fields.length === 0) {
    return getPostmortem(id);
  }

  values.push(id);
  const result = await pool.query<Postmortem>(
    `UPDATE postmortems SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, incident_id, summary, impact, root_cause, resolution, timeline, lessons`,
    values
  );
  return result.rows[0] || null;
}
