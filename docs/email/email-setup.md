# Email Configuration for HomerConnect

This document outlines the email configuration for the HomerConnect application, which uses Mailtrap for development and Postmark for production.

## Environment Setup

### Development Environment (.env.development)

The development environment uses Mailtrap as a testing inbox to catch all outgoing emails without sending them to real recipients:

```
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=f634dd8ce1a90e
SMTP_PASS=9371260fe81e70
```

### Production Environment (.env.production)

The production environment uses Postmark for reliable email delivery:

```
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
SMTP_USER=${POSTMARK_SERVER_TOKEN}
SMTP_PASS=${POSTMARK_SERVER_TOKEN}
FROM_EMAIL="hello@homer-events.org"
```

## Mail Components

### 1. NestJS Backend Mail Module

Located in `/apps/backend/src/mail/`:

- `mail.module.ts`: Configures the NestJS mailer module with environment-specific SMTP settings
- `mail.service.ts`: Provides methods for sending different types of emails (test, RSVP confirmation, etc.)
- `templates/`: Contains Handlebars templates for various email types

### 2. Next.js Server Actions

The frontend includes a server action for sending emails:

- `/apps/frontend/src/app/actions/sendTest.ts`: Server action for sending test emails directly from Next.js

### 3. Supabase Auth Email Integration

Supabase Auth is configured to use the same SMTP settings for sending authentication emails (magic links, password resets):

- `supabase/config.toml`: Contains SMTP configuration that reads from environment variables

## Testing Email Functionality

### Testing Mailtrap (Development)

Use one of the following methods:

1. **Backend API endpoint**: Send a POST request to `/send-test-email/your-email@example.com`

2. **Test script**: Run `node scripts/email/test-mailtrap.js`

3. **Frontend testing page**: Visit `/api-test` in the browser and use the email testing form

All emails in development will be captured in your Mailtrap inbox.

### Testing Postmark (Production)

Before going live, test the Postmark configuration:

1. Run `node scripts/email/test-postmark.js` (update the recipient email in the script)

2. Check the Postmark dashboard for delivery status and issues

## Domain Setup for Production

1. **DNS Configuration**:
   - Add DKIM record to your DNS
   - Add SPF include for Postmark
   - Configure Return-Path

2. **Sender Signature**:
   - Verify domain ownership in Postmark dashboard
   - Set up a verified sending identity (typically hello@homer-events.org)

## Switching Between Environments

The application automatically uses the correct configuration based on the environment:

- Local development: Uses Mailtrap configuration from `.env.development`
- Production: Uses Postmark configuration from `.env.production`

## Troubleshooting

### Common Issues

- **Emails not appearing in Mailtrap**: Check credentials in `.env.development`
- **Authentication emails not working**: Verify Supabase Auth SMTP settings
- **Production email bounces**: Check Postmark dashboard for bounce details and domain verification status

### Logs and Monitoring

- Check NestJS server logs for email sending errors
- Postmark provides detailed logs and analytics for production emails

## Security Considerations

- All email credentials are stored in environment variables and not committed to Git
- Production tokens are managed through the CI/CD system's secret management
- Email templates avoid exposing sensitive user data
