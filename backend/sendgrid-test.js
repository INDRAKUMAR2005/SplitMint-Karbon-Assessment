require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'YOUR_EMAIL@example.com', // ⚠️ CHANGE THIS to your actual email address
  from: 'YOUR_VERIFIED_SENDER@example.com', // ⚠️ CHANGE THIS to your verified SendGrid sender email
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
    console.log('You can now click "Next" in the SendGrid dashboard.');
  })
  .catch((error) => {
    console.error('❌ Error sending email:');
    console.error(error.response ? error.response.body : error);
  });
