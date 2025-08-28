CREATE TABLE IF NOT EXISTS actions (
  id SERIAL PRIMARY KEY,
  postmortem_id INT REFERENCES postmortems(id),
  description TEXT,
  owner TEXT,
  status TEXT,
  due_date DATE
);
