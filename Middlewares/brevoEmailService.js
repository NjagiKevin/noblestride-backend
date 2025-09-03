
const axios = require('axios');

const sendEmail = async (to, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('Brevo API key is missing.');
    return;
  }

  const options = {
    method: 'POST',
    url: 'https://api.brevo.com/v3/smtp/email',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    data: {
      sender: {
        name: 'Noblestride',
        email: 'noreply@noblestride.com'
      },
      to: [
        {
          email: to
        }
      ],
      subject: subject,
      htmlContent: htmlContent
    }
  };

  try {
    await axios.request(options);
    console.log('Email sent successfully using Brevo');
  } catch (error) {
    console.error('Error sending email using Brevo:', error);
  }
};

module.exports = { sendEmail };
