const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TTL: process.env.JWT_TTL,
  SENDEMAIL_API_KEY: process.env.SENDEMAIL_API_KEY,
  SENDEMAIL_NOREPLY_EMAIL: process.env.SENDEMAIL_NOREPLY_EMAIL,
};
