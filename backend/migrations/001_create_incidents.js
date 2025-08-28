exports.up = (pgm) => {
  pgm.createTable('incidents', {
    id: 'id',
    title: { type: 'text', notNull: true },
    service: { type: 'text', notNull: true },
    severity: { type: 'integer', notNull: true },
    status: { type: 'text', notNull: true },
    date_detected: { type: 'timestamptz', notNull: true },
    date_resolved: { type: 'timestamptz' },
    sla_hours: { type: 'integer' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('incidents');
};

