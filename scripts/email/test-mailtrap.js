// Simple Node.js script to test Mailtrap configuration

const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

async function main() {
  console.log('Creating test email transport with the following settings:');
  console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`SMTP User: ${process.env.SMTP_USER}`);
  console.log(`SMTP Pass: ${process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'undefined'}`);

  // Create a transporter using Mailtrap credentials
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send a test email
  try {
    const info = await transporter.sendMail({
      from: '"Homer Calendar Test" <test@homer-events.org>',
      to: 'test@example.com',
      subject: 'Test Email from Mailtrap',
      text: 'This is a test email sent from the Node.js script to verify Mailtrap configuration.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4a56e2; color: white; padding: 20px; text-align: center;">
            <h1>Homer Calendar</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Mailtrap Test</h2>
            <p>This email was sent from a Node.js script to verify our Mailtrap configuration.</p>
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
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main().catch(console.error);
