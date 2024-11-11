const router = require('express').Router();

const {
  postLogin,
  postRegister,
  verifyEmail,
  confirmEmail,
  getProfile,
} = require('../controllers/auth.controller');

const {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
} = require('../controllers/furniture.controller');

router.route('/register').post(postRegister);

router.route('/login').post(postLogin);

router.route('/email_verification').post(verifyEmail);

router.route('/send_email_verification_token').post(confirmEmail);

router.route('/profile').get(getProfile);

router.route('/furniture').get(getAllFurniture);

router.route('/furniture/:id').get(getFurnitureById);

module.exports = router;
