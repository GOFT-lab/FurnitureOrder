const Email = require('./src/utils/email');

const token = 'ABC123';
const name = 'John Doe';
const emailAddress = 'goft228@gmail.com';

(async () => {
  try {
    await Email.sendConfirmationOnEmail(token, name, emailAddress);
  } catch (error) {
    console.error('Error sending email:', error);
  }
})();
