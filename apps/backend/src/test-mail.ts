import * as nodemailer from 'nodemailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function main() {
  console.log('Testing Nodemailer with Mailtrap');
  console.log('Environment settings:');
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'undefined'}`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Read the template file
    const templatePath = join(__dirname, 'mail/templates/test.hbs');
    console.log(`Template path: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);

    // Prepare email content
    const context = {
      name: 'Test User',
      date: new Date().toLocaleDateString(),
      year: new Date().getFullYear(),
    };

    const html = template(context);

    // Send a test email using the template
    const info = await transporter.sendMail({
      from: '"Homer Calendar" <hello@homer-events.org>',
      to: 'test@example.com',
      subject: 'Test Email from NestJS',
      html,
    });

    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

main()
  .then(() => console.log('Test complete'))
  .catch((err) => console.error('Test failed:', err));
