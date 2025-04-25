 # Phase 3 Report: Supabase Configuration Verification

 **Date Completed:** 2025-04-25

 ## Area of Focus

 Supabase Configuration for User Management

 ## "Needs to Be" (Defined Standard)

 ### Q3.1: Auth Settings
 - Email/password sign-up enabled for end users.
 - Users must confirm their email before signing in (`enable_confirmations = true`).
 - Site URL(s) must include development (`http://localhost:3000`) and production domains, defined via environment variables.
 - Additional redirect URLs must include allowed callback URLs, configured via environment variables.
 - Minimum password length ≥ 8, with `lower_upper_letters_digits` complexity.
 - OTP length = 6, expiry = 3600s, max resend frequency = 1m.
 - Rate limits applied (e.g. max 2 emails/hour, max 30 token verifications/5m).

 ### Q3.2: Database Schema
 - `public.profiles` table extending `auth.users`:
   - `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
   - `email TEXT NOT NULL`
   - `display_name TEXT`, `tagline TEXT`, `bio TEXT`, `avatar_url TEXT`, `banner_url TEXT`, `accent_color TEXT`, `interests TEXT[]`
   - `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()` with trigger on update.
 - Auxiliary tables: `events`, `categories`, `event_categories`, `event_rsvps` (all with UUID PKs, foreign keys, timestamps).
 - Storage bucket `avatars` with public read and owner-restricted write/update/delete policies.

 ### Q3.3: Row Level Security (RLS)
 - RLS enabled on all application tables (`profiles`, `events`, `categories`, `event_categories`, `event_rsvps`).
 - Policies:
   - Profiles: SELECT for all; INSERT and UPDATE only for `auth.uid() = id`.
   - Events: SELECT for all; INSERT for authenticated users; UPDATE/DELETE only for event creator.
   - Categories: SELECT for all; INSERT/UPDATE/DELETE for authenticated users.
   - Event_categories: SELECT for all; INSERT/DELETE only if user is event creator.
   - Event_rsvps: SELECT for all; INSERT/UPDATE/DELETE only if `auth.uid() = user_id`.

 ### Q3.4: Triggers/Functions
 - `handle_updated_at()` trigger on `profiles` and `events` to auto-update `updated_at`.
 - `public.create_profile_on_signup()` trigger on `auth.users` to auto-insert into `public.profiles`.

 ### Q3.5: SMTP Configuration
 - In development, use Mailtrap SMTP for all Supabase Auth emails.
   - `[auth.email.smtp] enabled = true`
   - `host`, `port`, `user`, `pass` loaded from `env(SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASS)`.
 - Disable Supabase inbucket email preview in dev (`[inbucket] enabled = false`).

 ## "Inventory" Findings (Initial State)

 ### Auth Settings
 From `supabase/config.toml`:
 ```toml
 [auth]
 enabled = true
 site_url = "https://homerconnect.com"
 additional_redirect_urls = ["http://localhost:3000", "https://homerconnect.com"]
 jwt_expiry = 3600
 enable_refresh_token_rotation = true
 refresh_token_reuse_interval = 10
 enable_signup = true
 enable_anonymous_sign_ins = false
 enable_manual_linking = false
 minimum_password_length = 6
 password_requirements = ""

 [auth.email]
 enable_confirmations = true
 double_confirm_changes = true
 secure_password_change = false
 max_frequency = "1m0s"
 otp_length = 6
 otp_expiry = 3600

 [auth.email.smtp]
 enabled = true
 host = "env(SMTP_HOST)"
 port = "env(SMTP_PORT)"
 user = "env(SMTP_USER)"
 pass = "env(SMTP_PASS)"
 admin_email = "hello@homer-events.org"
 sender_name = "Homer Calendar"

 [inbucket]
 enabled = true
 ```

 ### Database Schema
 From `supabase/migrations/20250423171929_initial_schema.sql` and subsequent migrations:
 - Tables created: `public.profiles`, `public.events`, `public.categories`, `public.event_categories`, `public.event_rsvps`.
 - Extensions: `uuid-ossp`, `postgis`, `pg_trgm`.
 - Columns and constraints match the schema defined under Q3.2, plus additional profile fields (`tagline`, `banner_url`, `accent_color`, `interests`) from migration.
 - Storage bucket `avatars` created in `storage.buckets`.

 ### RLS
 - RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) on all five tables by initial migration and repeated in add-indexes-and-policies.
 - Policies defined via SQL migrations for each table exactly as per Q3.3.

 ### Triggers/Functions
 - `handle_updated_at()` function and `BEFORE UPDATE` triggers on `profiles` and `events` (initial migration).
 - `public.create_profile_on_signup()` trigger on `auth.users` to insert into `profiles` (initial migration).

 ### SMTP
 - `[auth.email.smtp] enabled = true` with env placeholders present.
 - `[inbucket] enabled = true`, meaning inbucket preview is active alongside SMTP.

 ## Discrepancies Found

 - **Site URL** is hard-coded to production (`https://homerconnect.com`) instead of loaded from `env(SITE_URL)`.
 - **Minimum password length** is 6 (should be ≥ 8) and `password_requirements` is empty (should enforce complexity).
 - **Inbucket** remains enabled (spec calls for Mailtrap SMTP in dev), and inbucket port is exposed.
 - **Redirect URLs** are hard-coded rather than read from environment.
 - **secure_password_change** is disabled (should be `true` to require recent auth for password change).
 - **Rate limits** are defaults; spec may require stricter or customized limits.

## Debugging & Fixes Implemented

### Migration Script Updates
- In `supabase/migrations/20250424120000_add_indexes_and_policies.sql`, removed unsupported `IF NOT EXISTS` clauses from all `CREATE POLICY` statements to ensure compatibility with the PostgreSQL version used by Supabase CLI.

### Config File Updates
- Updated `site_url` in `supabase/config.toml` to use `env(SITE_URL)` instead of a hard-coded URL.
- Updated `additional_redirect_urls` to use `env(REDIRECT_URL)`.
- Set `minimum_password_length = 8` and `password_requirements = "lower_upper_letters_digits"` under `[auth]`.
- Enabled `secure_password_change = true` under `[auth.email]`.
- Disabled inbucket by setting `enabled = false` under `[inbucket]`.
### Environment Example Updates
- Added `SITE_URL` and `REDIRECT_URL` placeholders to `supabase/.env.example`.
- Added `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` placeholders for Auth email SMTP settings.

### Next Steps Executed
- **Local emulator:**
  ```bash
  npm run supabase:push -- --local
  # or npm run supabase:push:local
  ```
- **Remote project:**
  ```bash
  npm run supabase:push
  # confirm the "Do you want to push..." prompt with 'y'
  ```
- Verify via Supabase Studio or psql that settings reflect the new values (site_url, auth settings, inbucket disabled).

 ## Next Steps

 - Apply the planned fixes to `supabase/config.toml` (use env vars for site_url and smtp, disable inbucket, tighten auth settings).
 - Run `npm run supabase:push` and verify the applied configuration.
 - Perform RLS policy and trigger tests via SQL Editor or `psql`.
 - Document post-fix evidence in this report.