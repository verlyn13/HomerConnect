### Where these Mailtrap values go

| Mailtrap screen | `.env.development` ( local ) | Supabase Auth (local docker) | NestJS Mailer config | Notes |
|-----------------|------------------------------|-----------------------------|----------------------|-------|
| **Host** `sandbox.smtp.mailtrap.io` | `SMTP_HOST=sandbox.smtp.mailtrap.io` | `MAILER_HOST=sandbox.smtp.mailtrap.io` | `host: process.env.SMTP_HOST,` | All tools read the same var. |
| **Port** `25, 465, 587, 2525` | `SMTP_PORT=587` | `MAILER_PORT=587` | `port: +process.env.SMTP_PORT,` | 587 + STARTTLS works everywhere; use 2525 if 587 is blocked. |
| **Username** | `SMTP_USER=f634dd8ce1a90e` | `MAILER_USER=…` | `auth: { user: process.env.SMTP_USER,` | Copy exactly. |
| **Password** | `SMTP_PASS=••••1e70` | `MAILER_PASS=…` | `pass: process.env.SMTP_PASS },` | Click the *eye* icon to reveal & copy. |
| **TLS / Auth** `STARTTLS, PLAIN` | — | — | `secure: false,   // STARTTLS` | Nodemailer/Nest starts TLS automatically. |

> **Never commit the real user / password** – store them in your local `.env.development` and in CI secrets only.

---

### 1 · Next 14 server actions (optional quick test)

```ts
'use server';
import nodemailer from 'nodemailer';

export async function sendDevMail() {
  const tx = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    secure: false,          // STARTTLS
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await tx.sendMail({
    from: '"Homer Dev" <dev@homer.local>',
    to: 'test@homer.local',
    subject: 'Hello from Mailtrap',
    text: 'If you can read this, Mailtrap is wired up.',
  });
}
```

Open the Mailtrap inbox—your message will appear instantly.

---

### 2 · NestJS MailerModule

```ts
// src/mail/mail.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

MailerModule.forRoot({
  transport: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,                       // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  defaults: {
    from: '"Homer Calendar" <hello@homer.test>',
  },
  template: {
    dir: __dirname + '/templates',
    adapter: new HandlebarsAdapter(),
  },
});
```

When you switch to Postmark in production, only the four env vars change.

---

### 3 · Supabase Auth (local)

1. Run `supabase start`.
2. `supabase/config.toml` → under `[auth.smtp]` set:

```toml
[auth.smtp]
host = "sandbox.smtp.mailtrap.io"
port = 587
user = "f634dd8ce1a90e"
pass = "••••1e70"
sender_name = "Homer Calendar Dev"
sender_email = "noreply@homer.test"
```

Restart `supabase start`; magic-link mails now hit Mailtrap.

---

### 4 · CI / Preview deploys

Add the same four keys to your CI secret store (GitHub / GitLab):

```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```

Preview builds will use Mailtrap; production builds will overwrite them with Postmark creds.

---

#### ✅ Checklist

- [ ] Copied Host, Port 587, Username, Password into `.env.development`.
- [ ] Added the same to `supabase/config.toml` under `[auth.smtp]`.
- [ ] Verified a test email shows in the Mailtrap inbox.
- [ ] **Do not** push the credentials to Git—`.env*` are git-ignored.

That’s all you need: Mailtrap is now your fake inbox for every local and staging email.
