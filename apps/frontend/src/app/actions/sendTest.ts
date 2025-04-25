'use server';

import type { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';

/**
 * Send a test email to verify email configuration
 * @param to Email recipient
 */
export async function sendTest(to: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!
    },
  });

  await transporter.sendMail({
    to,
    from: '"Homer Calendar" <hello@homer-events.org>',
    subject: 'Test Email from Homer Calendar (Next.js)',
    text: 'This is a test email sent from the Next.js frontend.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4a56e2; color: white; padding: 20px; text-align: center;">
          <h1>Homer Calendar</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Test Email from Next.js</h2>
          <p>This email was sent from a Next.js server action to verify our email configuration.</p>
          <p>Date sent: ${new Date().toLocaleString()}</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Homer Calendar. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}
