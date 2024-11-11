const createModelHelper = require('../helpers/model.helper');

const name = 'EmailVerification';
const tableName = 'email_verification';
const selectableProps = ['token', 'email'];

module.exports = (knex) => {
  const emailVerificationHelper = createModelHelper({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const create = (props) => emailVerificationHelper.create(props);

  const verifyEmail = async (email, token) => {
    try {
      //console.log(`Starting email verification for: ${email}`);
      //console.log(`Token provided for verification: ${token}`);

      const emailVerification = await knex
        .select()
        .from(tableName)
        .where({ email });

      //console.log('Email verification result:', emailVerification);

      const validToken = emailVerification.find((item) => item.token === token);

      if (validToken) {
        //console.log('Token is valid. Proceeding to update user status.');
        const updateResult = await knex('users')
          .update({
            email_verification_status: 'VERIFIED',
          })
          .where({ email });

        if (updateResult === 0) {
          //console.log('User not found or not updated');
          return {
            status: false,
            message: 'User not found or not updated',
          };
        }
        await knex(tableName).where({ email }).delete();

        return {
          status: true,
          message: 'Valid Token, email verified',
        };
      } else {
        //console.log('Invalid Token provided.');
        return {
          status: false,
          message: 'Invalid Token',
        };
      }
    } catch (error) {
      console.error('Error during email verification:', error);
      return {
        status: false,
        message: 'An error occurred during verification',
      };
    }
  };

  return {
    name,
    ...emailVerificationHelper,
    create,
    verifyEmail,
  };
};
