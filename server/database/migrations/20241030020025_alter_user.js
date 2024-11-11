/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  try {
    await knex.schema.alterTable('users', (table) => {
      table
        .text('email_verification_status')
        .defaultTo('NOTVERIFIED')
        .notNullable();
    });

    await knex.schema.raw(
      "ALTER TABLE users ADD CONSTRAINT users_email_verification_check CHECK (email_verification_status = ANY (ARRAY['NOTVERIFIED', 'VERIFIED']));"
    );
  } catch (error) {
    console.error('Error adding column:', error);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.raw(
    'ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_verification_check;'
  );
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('email_verification_status');
  });
};
