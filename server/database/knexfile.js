require('dotenv').config({ path: `${__dirname}/../.env` });

const environments = {
  dev: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'furniture_order',
    },
    migrations: {
      directory: `${__dirname}/migrations`,
    },
    seeds: {
      directory: `${__dirname}/seeds`,
    },
  },
  prod: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

const currentConfig = environments[process.env.NODE_ENV] || environments.dev;
module.exports = currentConfig;
