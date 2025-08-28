import pool from '../db';

export interface Incident {
  id: number;
  title: string;
  service: string;
  severity: number;
  status: string;
  date_detected: Date;
}

export async function listIncidents(): Promise<Incident[]> {
  const result = await pool.query<Incident>(
    'SELECT id, title, service, severity, status, date_detected FROM incidents ORDER BY id'
  );
  return result.rows;
}

export async function getIncident(id: number): Promise<Incident | null> {
  const result = await pool.query<Incident>(
    'SELECT id, title, service, severity, status, date_detected FROM incidents WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

