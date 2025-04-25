### Postmark production setup checklist

*(Everything you need to do on the screen you shared, in order, plus the matching code/​env settings for the Homer Calendar stack.)*

| # | Portal action | Why it matters | Hand-off artefact |
|---|---------------|----------------|-------------------|
| **1** | **Stay in “My First Server” → leave the two defaults**  • **Default Transactional Stream** – keep for sign-up links, RSVP mail, reminders.<br> • **Default Broadcast Stream** – leave unused for now (bulk digests will live in SendGrid later). | Message Streams isolate metrics and rate limits. Using the built-in transactional stream is fine for a single app. citeturn0search0 | Stream ID (copy later) |
| **2** | **Sender Signatures tab → “Add Domain or Address”**<br>Choose **Domain** (e.g. `homer-events.org`). | Domain verification lets every `@homer-events.org` address send without adding each one. | DNS TXT values for SPF + DKIM. |
| **3** | **Copy DKIM & SPF records** from the modal and add them to Cloudflare (or your DNS). | Authenticated mail = high deliverability. citeturn0search1 | Screenshot of DNS set + green checkmarks. |
| **4** | **Verify ownership** (click “Check DNS”). | Postmark must see the DKIM/SPF records before it will sign outgoing mail. |  |
| **5** | **Templates tab → create “Magic Link”, “Password Reset”, “RSVP Confirm”** (or import later via API). | Central place to edit copy/branding without redeploying code. | Template IDs (JSON or sheet). |
| **6** | **API Tokens tab → reveal Server API Token** (keep it secret!) | Needed for REST sends, webhooks, and SMTP. citeturn0search5 | Store in 1Password / CI secret named `POSTMARK_SERVER_TOKEN`. |
| **7** | **Copy the Transactional Stream ID** (click into the stream → Settings). | Required if you invoke the REST API; not required for plain SMTP. | `POSTMARK_STREAM_ID` secret. |
| **8** | **Toggle off “Test mode”** → **Request approval** | Until approved, Postmark only sends to confirmed Sender Signatures. Provide a short description: <br>“Local community calendar (K-6 families, ≤3 000 tx email/mo).” | Approval ticket ID. |
| **9** | **(Optional) Settings → Webhooks** → add `https://api.homer-events.org/email/webhook` for `Delivery`, `Bounce`, `SpamComplaint`. | Lets NestJS flag hard-bounce addresses and keep Supabase profiles clean. | Webhook signing key. |

---

#### Production environment variables

```dotenv
# .env.production  (Vercel + Nest VPS)
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
SMTP_USER=${POSTMARK_SERVER_TOKEN}
SMTP_PASS=${POSTMARK_SERVER_TOKEN}
POSTMARK_STREAM_ID=<Transactional Stream ID>   # if you use REST API
FROM_EMAIL="hello@homer-events.org"
```

*Supabase Auth* → Dashboard → **Auth → SMTP**
paste the same four SMTP values (host/port/user/pass). That alone switches all magic-link and reset emails to Postmark.

---

#### Minimal NestJS mailer snippet

```ts
// mail.module.ts
MailerModule.forRoot({
  transport: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,           // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  defaults: {
    from: `"Homer Calendar" <${process.env.FROM_EMAIL}>`,
  },
});
```

---

### What to hand over

1. **Credentials & secrets**
   * `POSTMARK_SERVER_TOKEN` (masked)
   * `POSTMARK_STREAM_ID` (or tell devs to use SMTP only)

2. **DNS change log** – record each TXT you added and its TTL.

3. **Template ID list** – for CI sync or manual edits.

4. **Operational note** – Postmark limits you to 100 emails/hr until approval is granted; plan initial smoke tests accordingly.

With these nine portal steps and the env settings above, Postmark will be ready the moment the app flips from Mailtrap to production.
