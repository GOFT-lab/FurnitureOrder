const {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  GENERAL_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE,
} = require('../helpers/error.helper');

const errorResponses = {
  [UNAUTHORIZED]: (err) => ({
    message: err.message || 'Unauthorized',
    errors: [err],
  }),
  [FORBIDDEN]: (err) => ({
    message: err.message || 'Forbidden',
    errors: [err],
  }),
  [CONFLICT]: (err) => ({
    message: err.message || 'Conflict',
    errors: [err],
  }),
  [BAD_REQUEST]: (err) => ({
    message: err.message || 'Bad request',
    errors: [err],
  }),
  [UNPROCESSABLE]: (err) => ({
    message: err.message || 'Unprocessable',
    errors: [err],
  }),
  [NOT_FOUND]: (err) => ({
    message: err.message || 'Not Found',
    errors: [err],
  }),
  [GENERAL_ERROR]: (err) => ({
    message: err.message || 'General Error',
    errors: [err],
  }),
};

const handleError = (err, req, res) => {
  const status = err.status || GENERAL_ERROR;
  const response = errorResponses[status];

  if (response) {
    res.status(status).send({ ok: false, ...response(err) });
  } else {
    res.status(GENERAL_ERROR).send({
      ok: false,
      message: err.message || 'General Error',
      errors: [err],
    });
  }
};

const all = (err, req, res, next) => {
  handleError(err, req, res);
};

module.exports = {
  all,
};
