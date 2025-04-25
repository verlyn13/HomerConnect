// Simple Node.js script to test Postmark configuration in production environment

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.production' }); // Load production environment variables

async function main() {
  console.log('Testing Postmark email configuration');
  console.log('Environment settings:');
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`POSTMARK_SERVER_TOKEN: ${process.env.POSTMARK_SERVER_TOKEN ? '****' + process.env.POSTMARK_SERVER_TOKEN.slice(-4) : 'undefined'}`);

  // Create a transporter using Postmark credentials
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
      user: process.env.POSTMARK_SERVER_TOKEN,
      pass: process.env.POSTMARK_SERVER_TOKEN,
    },
  });

  // Send a test email
  try {
    const info = await transporter.sendMail({
      from: '"Homer Calendar" <hello@homer-events.org>',
      to: 'test@example.com', // replace with your actual email for testing
      subject: 'Test Email from Postmark',
      text: 'This is a test email sent from the Node.js script to verify Postmark configuration.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4a56e2; color: white; padding: 20px; text-align: center;">
            <h1>Homer Calendar</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Postmark Test</h2>
            <p>This email was sent from a Node.js script to verify our Postmark configuration.</p>
            <p>Date sent: ${new Date().toLocaleString()}</p>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Homer Calendar. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Execute the main function
main().catch(console.error);
