const Brevo = require('@getbrevo/brevo');
const format = require('string-template');
const { SENDEMAIL_API_KEY, SENDEMAIL_NOREPLY_EMAIL } = require('../../config');

const defaultClient = Brevo.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = SENDEMAIL_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

const emailTemplate = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f1f1; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
  <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
    <h2 style="color: black; text-align: center;">Verify Your Email Address</h2>
    <p style="font-size: 16px; color: #333;">Hello <strong>{userName}</strong>,</p>
    <p style="font-size: 16px; color: #333;">Welcome to the Online Furniture Order APP! Please use the token below to confirm your email address:</p>
    <h3 style="color: #000; font-weight: bold; text-align: center; background-color: #e8e8e8; padding: 10px; border-radius: 5px; margin: 20px 0;">
      {token}
    </h3>
    <p style="font-size: 14px; color: #777; text-align: center;">N.B. Please do not reply to this email.</p>
  </div>
</div>
`;

exports.sendConfirmationOnEmail = async (token, userName, userEmail) => {
  const msg = {
    sender: {
      email: SENDEMAIL_NOREPLY_EMAIL,
      name: 'Furniture Order',
    },
    to: [
      {
        email: userEmail,
        name: userName,
      },
    ],
    subject:
      'Confirm your email address for registration in Online Furniture Order App',
    htmlContent: format(emailTemplate, {
      userName,
      token,
    }),
  };

  // console.log('Sending email to:', userEmail);
  // console.log('Email content:', msg);

  // console.log(SENDEMAIL_NOREPLY_EMAIL);

  try {
    const data = await apiInstance.sendTransacEmail(msg);
  } catch (error) {}
};
