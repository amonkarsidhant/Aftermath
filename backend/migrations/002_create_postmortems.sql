CREATE TABLE IF NOT EXISTS postmortems (
  id SERIAL PRIMARY KEY,
  incident_id INT REFERENCES incidents(id),
  summary TEXT,
  impact TEXT,
  root_cause TEXT,
  resolution TEXT,
  timeline JSONB,
  lessons TEXT
);
