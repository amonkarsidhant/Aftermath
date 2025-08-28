import { Pool } from 'pg';

const pool = new Pool();

export interface Action {
  id: number;
  postmortem_id: number;
  description: string;
  owner: string;
  status: string;
  due_date: Date | null;
}

export interface ActionInput {
  postmortem_id: number;
  description: string;
  owner: string;
  status: string;
  due_date?: Date;
}

export async function createAction(data: ActionInput): Promise<Action> {
  const result = await pool.query<Action>(
    `INSERT INTO actions (postmortem_id, description, owner, status, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, postmortem_id, description, owner, status, due_date`,
    [
      data.postmortem_id,
      data.description,
      data.owner,
      data.status,
      data.due_date || null,
    ]
  );
  return result.rows[0];
}

export async function listActions(): Promise<Action[]> {
  const result = await pool.query<Action>(
    `SELECT id, postmortem_id, description, owner, status, due_date FROM actions ORDER BY id`
  );
  return result.rows;
}

export async function updateActionStatus(id: number, status: string): Promise<Action | null> {
  const result = await pool.query<Action>(
    `UPDATE actions SET status = $1 WHERE id = $2 RETURNING id, postmortem_id, description, owner, status, due_date`,
    [status, id]
  );
  return result.rows[0] || null;
}
