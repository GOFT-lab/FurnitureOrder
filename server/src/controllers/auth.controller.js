const knex = require('../../database/connection');
const User = require('../models/user.model')(knex);
const EmailVerification = require('../models/email_verification.model')(knex);
const Email = require('../utils/email');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {
  createError,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
} = require('../helpers/error.helper');

const passwordValidation = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const isValidLength = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasDigits && isValidLength;
};

const sendEmailConfirmation = async (name, email) => {
  const token = crypto.randomBytes(3).toString('hex');
  try {
    await EmailVerification.create({ token, email });
    await Email.sendConfirmationOnEmail(token, name, email);
  } catch (error) {
    throw createError({
      status: BAD_REQUEST,
      message: 'Failed to confirm email.',
    });
  }
};

const confirmEmail = async (req, res, next) => {
  const { email, name } = req.body.headers || req.body;

  if (!email || !name) {
    return next(
      createError({
        status: BAD_REQUEST,
        message: 'Name and email are required fields',
      })
    );
  }

  try {
    await sendEmailConfirmation(name, email);
    res.json({
      ok: true,
      message: 'Confirmation email sent successfully',
    });
  } catch (e) {
    console.error('Error sending confirmation email:', e);
    next(e);
  }
};

const postRegister = async (req, res, next) => {
  const { email, first_name, last_name, password, confirm_password } =
    req.body.user;

  if (!email || !first_name || !last_name || !password || !confirm_password) {
    return next(
      createError({
        status: BAD_REQUEST,
        message:
          'First name, last name, email, password, and confirm password are required fields',
      })
    );
  }
  if (password !== confirm_password) {
    return next(
      createError({
        status: BAD_REQUEST,
        message: 'Password and confirm password do not match',
      })
    );
  }
  if (!passwordValidation(password)) {
    return next(
      createError({
        status: BAD_REQUEST,
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit.',
      })
    );
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(
        createError({
          status: CONFLICT,
          message: 'Email already used',
        })
      );
    }

    user = await User.create({ email, first_name, last_name, password });
    res.json({
      ok: true,
      message: 'Registration Successful',
      user,
    });
  } catch (e) {
    console.error('Error during registration:', e);
    next(e);
  }
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log('Login attempt:', { email, password });
  if (!email || !password) {
    return next(
      createError({
        status: BAD_REQUEST,
        message: 'Email and password are required fields',
      })
    );
  }
  if (!passwordValidation(password)) {
    return next(
      createError({
        status: BAD_REQUEST,
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit.',
      })
    );
  }

  try {
    const user = await User.verify(email, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    }); // Генеруємо токен

    return res.json({
      ok: true,
      message: 'Login Successful',
      token, // Повертаємо токен
      verified: user.email_verification_status === 'VERIFIED',
    });
  } catch (e) {
    console.error('Error during login:', e);
    return next(
      createError({
        status: UNAUTHORIZED,
        message: e.message,
      })
    );
  }
};

const verifyEmail = async (req, res, next) => {
  const { email, token } = req.body;

  try {
    const verified = await EmailVerification.verifyEmail(email, token);
    if (!verified) {
      return next(
        createError({
          status: NOT_FOUND,
          message: 'Invalid email or token',
        })
      );
    }
    res.json({
      ok: true,
      message: 'Email verified successfully',
    });
  } catch (e) {
    console.error('Error during email verification:', e);
    return next(
      createError({
        status: UNAUTHORIZED,
        message: 'Failed to verify email.',
      })
    );
  }
};

const getProfile = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Отримуємо токен з заголовка

  if (!token) {
    return next(
      createError({ status: UNAUTHORIZED, message: 'No token provided.' })
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Декодуємо токен
    const userId = decoded.id; // Отримуємо userId

    const user = await User.findById(userId); // Виконуємо запит до бази даних
    if (!user) {
      return next(
        createError({ status: NOT_FOUND, message: 'User not found' })
      );
    }

    res.json({
      ok: true,
      user,
    });
  } catch (e) {
    console.error('Error fetching user profile', e);
    return next(
      createError({
        status: UNAUTHORIZED,
        message: 'Failed to authenticate token.',
      })
    );
  }
};

module.exports = {
  postLogin,
  postRegister,
  verifyEmail,
  sendEmailConfirmation,
  getProfile,
  confirmEmail,
};
