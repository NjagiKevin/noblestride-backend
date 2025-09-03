const brevoEmailService = require('../brevoEmailService');
const office365EmailService = require('../office365Email/office365EmailService');

const sendEmail = async (to, subject, htmlContent) => {
  const emailProvider = process.env.EMAIL_PROVIDER;

  if (emailProvider === 'brevo') {
    await brevoEmailService.sendEmail(to, subject, htmlContent);
  } else if (emailProvider === 'office365') {
    // The office365EmailService.sendOffice365Email function requires an access token.
    // This is a simplified example. In a real application, you would need to obtain a valid access token.
    const accessToken = 'DUMMY_ACCESS_TOKEN'; // Replace with a valid access token
    const emailOptions = {
      to: to,
      subject: subject,
      html: htmlContent
    };
    await office365EmailService.sendOffice365Email(accessToken, emailOptions);
  } else {
    console.error('No email provider specified in the configuration.');
  }
};

module.exports = { sendEmail };
