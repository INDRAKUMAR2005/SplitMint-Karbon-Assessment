require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  // Create a transporter object using Gmail SMTP
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,       // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD // Your 16-character App Password
    }
  });

  try {
    let info = await transporter.sendMail({
      from: `"SplitMint Auth" <${process.env.GMAIL_USER}>`, 
      to: 'indrakumar252005@gmail.com',
      subject: 'Hello from Node.js via Gmail!',
      text: 'This email was sent using Nodemailer and Gmail instead of SendGrid.',
      html: '<strong>This email was sent using Nodemailer and Gmail instead of SendGrid.</strong>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error(error);
  }
}

sendTestEmail();
