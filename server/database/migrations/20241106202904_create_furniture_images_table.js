/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('furniture_images', (table) => {
    table.increments('id').primary();
    table.integer('furniture_id').unsigned().notNullable();
    table.string('image_url').notNullable();
    table.string('alt_text').defaultTo('');

    table
      .foreign('furniture_id')
      .references('id')
      .inTable('furniture')
      .onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('furniture_images');
};
