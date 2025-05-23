import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * Send a test email to verify email configuration
   * @param to Email recipient
   */
  async sendTest(to: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Test Email from Homer Calendar',
        template: './test',
        context: {
          name: 'Test User',
          date: new Date().toLocaleDateString(),
        },
      });
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw error;
    }
  }

  /**
   * Example method to send RSVP confirmation email
   * @param to Email recipient
   * @param event Event details
   * @param user User details
   */
  async sendRsvpConfirmation(to: string, event: any, user: any): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: `You're going to ${event.title}!`,
      template: './rsvp',
      context: {
        name: user.name,
        event,
        date: new Date(event.date).toLocaleDateString(),
        time: new Date(event.date).toLocaleTimeString(),
      },
    });
  }
}