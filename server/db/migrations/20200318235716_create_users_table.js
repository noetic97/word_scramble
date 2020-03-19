
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('user_name').unique().notNullable();
    table.string('password_digest').notNullable();
    table.string('email').unique().notNullable();
    table.string('img_url').unique();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
