const knex = require('knex');
const config = require('./knexfile'); // Отримайте поточну конфігурацію

const environment = process.env.NODE_ENV || 'dev'; // Встановіть environment за замовчуванням

if (!config) {
  throw new Error(
    `Knex configuration not found for environment: ${environment}`
  );
}

module.exports = knex(config);
