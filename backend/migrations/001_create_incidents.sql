CREATE TABLE IF NOT EXISTS incidents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  service TEXT NOT NULL,
  severity INT NOT NULL,
  status TEXT NOT NULL,
  date_detected TIMESTAMPTZ NOT NULL
);

