exports.up = (pgm) => {
  pgm.createTable('postmortems', {
    id: 'id',
    incident_id: {
      type: 'integer',
      references: 'incidents',
      onDelete: 'cascade',
    },
    summary: { type: 'text' },
    impact: { type: 'text' },
    root_cause: { type: 'text' },
    resolution: { type: 'text' },
    timeline: { type: 'jsonb' },
    lessons: { type: 'text' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('postmortems');
};

