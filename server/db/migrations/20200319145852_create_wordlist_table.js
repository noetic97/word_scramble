
exports.up = (knex) => {
  return Promise.all([
    knex.schema.createTable('phrases', (table) => {
      table.increments('id').primary();
      table.string('phrase').notNullable();
      table.integer('user_id').notNullable();
      table.foreign('user_id').references('users.id');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('wordlists', (table) => {
      table.increments('id').primary();
      table.json('words')
      table.integer('phrase_id').notNullable();
      table.foreign('phrase_id').references('phrases.id');

      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable('wordlists'),
    knex.schema.dropTable('phrases'),
  ]);
};
