exports.up = (pgm) => {
  pgm.createTable('actions', {
    id: 'id',
    postmortem_id: {
      type: 'integer',
      references: 'postmortems',
      onDelete: 'cascade',
    },
    description: { type: 'text' },
    owner: { type: 'text' },
    status: { type: 'text' },
    due_date: { type: 'date' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('actions');
};

