Below is a checklist of the **typical failure points** that cause the exact symptoms you’re seeing (login loop → “user not confirmed” → 500 on `/auth/v1/resend`) and the quickest way to verify or fix each one.

---

### 1. Confirm you’re hitting the right Auth server

| What to check | Why it matters | Quick test |
|---|---|---|
|`NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or equivalent env vars) | The client must talk to the same Supabase instance the browser cookie is scoped to. | In DevTools → Network, the failed `POST /auth/v1/token?grant_type=password` call should go to **exactly** the URL in your env file (including `localhost` vs `127.0.0.1`, scheme, and port). A mismatch gives a 400 and the silent “login page refresh”. |

*If you’re using the Supabase CLI emulator (`supabase start`), the URL must be `http://localhost:54321`.*

---

### 2. User-confirmation flow

1. **Was the account ever created?**
   Open `auth.users` in the Supabase dashboard (or run `select * from auth.users` locally). If the user row is missing, your front-end called `signInWithPassword` instead of `signUp` first.
2. **If the row exists, is `email_confirmed_at` null?**
   • `null` ⇒ the 400 *“User not confirmed”* is correct.
   • Set the project to **“Disable email confirmations”** temporarily (Auth → Settings → Email) so you can sign in while you debug email.

---

### 3. SMTP / “Error sending confirmation email” (500)

A 500 from `/auth/v1/resend` almost always means **Auth can’t reach your SMTP server** (the error is bubbled straight from GoTrue). Things to verify:

| Setting | Common pitfall |
|---|---|
| `AUTH_SMTP_HOST`, `PORT`, `USER`, `PASS` | Wrong port (587 is required for STARTTLS in most providers) citeturn0search7 |
| SSL mode (`AUTH_SMTP_TLS`) | If your provider only offers TLS on 465 you must set this flag; otherwise leave it false. |
| “FROM” address | Must be verified at the provider AND match `SMTP_ADMIN_EMAIL`. |
| Local dev | The CLI ships without an SMTP container. Spin up **MailHog** or **Mailpit** on port 1025 *or* disable confirmations during development. |

Supabase’s own troubleshooting guide walks through reading the Auth logs when you get a 500 citeturn0search6. The log usually spells out the SMTP error (e.g. “connection refused” or “authentication failed”).

---

### 4. CORS / Cookie domain / OpaqueResponseBlocking

Chrome’s new **Opaque Response Blocking (ORB)** aborts cross-site `no-cors` sub-requests when the MIME type looks sensitive. If your front-end runs on `http://localhost:3000` and the Supabase emulator is `http://127.0.0.1:54321`, the browser treats them as *different* sites and may block the auth cookie or even the fetch itself. Map both services to the **same host and protocol** (e.g. `127.0.0.1    localhost` in `/etc/hosts` or change env variables). citeturn1search2

---

### 5. Ignore the CSS warnings

`-webkit-text-size-adjust`, `-moz-osx-font-smoothing`, etc., are innocuous vendor-specific declarations; modern engines simply drop them. They don’t affect auth.

---

### 6. Quick triage path

1. **Disable email confirmations temporarily** → verify login succeeds.
2. **If it does:** your SMTP config is the only blocker – fix it or wire MailHog.
3. **If it still fails:** double-check the Supabase URL / anon key pair, then test a *fresh* sign-up flow (`signUp`) to confirm the request/response cycle.
4. Watch Network tab for:
   * `200` on `/auth/v1/signup`
   * `302` to redirect URL with `access_token` (if PKCE)
   * proper `Set-Cookie` (domain should match site).

---

### 7. Tooling that speeds this up

* **Supabase Dashboard → Auth → Logs** (or `supabase logs api`) to tail errors in real time.
* **MailHog/Mailpit** when running `supabase start` so confirmation links hit your inbox.
* **curl / httpie** to reproduce `POST /auth/v1/resend` outside the browser (rules out ORB/CORS).

Once these basics are squared away you should get a clean 200 on `/auth/v1/token?grant_type=password`, the session cookie will stick, and the login page won’t bounce back.
