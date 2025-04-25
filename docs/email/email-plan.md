Below is a **production ⇆ development e-mail flow** that drops cleanly into the stack you already have:

---

## 1 · Environment split

| Context | SMTP creds injected | Mailbox | Purpose |
|---------|--------------------|---------|---------|
| **Local & CI / Preview (dev)** | `MAILTRAP_…` | Mailtrap “Sandbox Inbox” | No real messages leave the building; devs review HTML, spam score, screenshots. |
| **Production (Vercel + Nest VPS)** | `POSTMARK_SERVER_TOKEN` | Postmark Transactional stream | Auth links, RSVP confirms, reminders—fast & inbox-safe. |

You change *only* the four SMTP variables between environments:

```dotenv
# .env.development  (Mailtrap)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=<MAILTRAP_USERNAME>
SMTP_PASS=<MAILTRAP_PASSWORD>

# .env.production   (Postmark)
SMTP_HOST=smtp.postmarkapp.com      # citeturn0search2
SMTP_PORT=587                       # citeturn0search4
SMTP_USER=<POSTMARK_TOKEN>
SMTP_PASS=<POSTMARK_TOKEN>
```

Supabase CLI, Vercel, and your Nest server each read from the env file or dashboard secrets.

---

## 2 · Supabase Auth setup

1. **Dashboard → Auth → SMTP settings**
   Paste the same four vars above.
2. **Email templates → “Magic link” & “Reset password”**
   Paste Postmark template HTML (keep the default placeholders `{{ .ConfirmationURL }}` etc.).
3. When `supabase start` runs locally it will hit Mailtrap; when deployed it will hit Postmark—no code changes.

---

## 3 · NestJS transactional mail

```ts
// src/mail/mail.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

MailerModule.forRoot({
  transport: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  defaults: {
    from: '"Homer Calendar" <hello@homer-events.org>',
  },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(),
  },
});
```

* `MailService.sendRsvpConfirmation()` (called when a user clicks **Going**) loads `rsvp.hbs`, passes `{ event, user }`, and sends through the same SMTP pipe.
* In dev you’ll see the message instantly in Mailtrap; in prod it lands via Postmark with DKIM/SPF already green-lit.

---

## 4 · Next.js server actions (edge-friendly)

```ts
// app/actions/sendTest.ts
'use server';
import nodemailer from 'nodemailer';

export async function sendTest(to: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  });

  await transporter.sendMail({
    to,
    subject: 'Hello from Homer!',
    text: 'This is a test.',
  });
}
```

Because it pulls from the same vars, it automatically switches Mailtrap⇆Postmark with the deployment target.

---

## 5 · Domain & deliverability checklist *(one-time)*

| Step | Postmark | Notes |
|------|----------|-------|
| Add **Sender Signature** `hello@homer-events.org` | ✔ | |
| Add **DKIM TXT** to DNS | ✔ | Guides in Postmark UI. |
| Add **SPF include:spf.mtasv.net** | ✔ | |
| Point MX records to your mailbox provider (not Postmark) | — | |

Mailtrap needs no DNS—dev only.

---

## 6 · Testing matrix

| Pipeline | What happens | Assert |
|----------|--------------|--------|
| `npm run test:e2e` (Jest) | Nest sends via Mailtrap creds | Use Mailtrap API to fetch last message JSON and snapshot its subject/body. |
| Playwright UI tests | Next server action → Mailtrap | Validate rendering in Mailtrap HTML viewer. |
| Preview deploy (Vercel “preview” env) | Still Mailtrap | Stakeholders can click emails safely. |
| Production deploy | Postmark | Monitor via Postmark dashboard & webhooks. |

---

## 7 · Webhooks & analytics (optional)

* **Postmark webhooks** → `api/email/webhook` (Nest controller)
  Handle `Delivered`, `Bounce`, `SpamComplaint`. Soft-bounce → retry, hard-bounce → flag user.
* **Mailtrap sandbox** provides spam score; fail build if > 5.

---

### TL;DR

* **One set of SMTP env vars** powers Supabase Auth, NestJS Mailer, and any Next.js edge actions.
* **Mailtrap in dev** keeps your inboxes clean; **Postmark in prod** guarantees fast, reputable delivery—all without branching code.
