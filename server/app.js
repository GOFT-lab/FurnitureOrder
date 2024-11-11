const express = require('express');
const errorMiddleware = require('./src/middleware/error.middleware');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
);
app.use('/', require('./src/routes/auth.route'));
app.use(errorMiddleware.all);

module.exports = app;
