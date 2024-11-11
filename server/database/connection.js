const knex = require('knex');
const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'dev';

if (!config) {
  throw new Error(
    `Knex configuration not found for environment: ${environment}`
  );
}

module.exports = knex(config);
