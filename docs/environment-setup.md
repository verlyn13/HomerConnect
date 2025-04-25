---
title: Environment & Secrets Setup
description: How to manage environment variables and secrets for local development, Replit previews, and production.
---

# Environment & Secrets Setup

> This guide explains how to securely manage environment variables and secrets for the Community Calendar monorepo in three contexts:
> - Local development (Fedora/macOS/Linux or VS Code)
> - Replit preview
> - Production deployment (Vercel + Supabase)

## 1. Local Development
All configuration values are loaded from a JSON file at `~/.secrets/HomerConnect/secrets.json` and injected into your app via the `load-secrets` script.

### 1.1 Create Your Local Secrets File
```bash
mkdir -p ~/.secrets/HomerConnect
cat > ~/.secrets/HomerConnect/secrets.json <<EOF
{
  "POSTGRES_PASSWORD": "your_local_db_password",  # pragma: allowlist secret
  "SUPABASE_URL": "http://localhost:54321",
  "SUPABASE_ANON_KEY": "your_anon_key",
  "NEXT_PUBLIC_SUPABASE_URL": "http://localhost:54321",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your_anon_key",
  "SMTP_HOST": "sandbox.smtp.mailtrap.io",
  "SMTP_PORT": "587",
  "SMTP_USER": "your_mailtrap_user",
  "SMTP_PASS": "your_mailtrap_password",
  "OPENAI_API_KEY": "your_openai_key_if_used"  # pragma: allowlist secret
}
EOF
```
> **Note:** This file is **outside** your repo and never checked in. Adjust values per your local setup.

### 1.2 Generate `.env` Files
Run the repository’s secret‐loading script:
```bash
npm run load-secrets
```
This populates:
- `./.env` — used by NestJS/Next.js (`dotenv` and `@nestjs/config`)
- `./supabase/.env` — used by the Supabase CLI for migrations

### 1.3 Start the App Locally
```bash
npm run supabase:start  # launch local Supabase emulator
npm run dev             # runs `predev` (load-secrets) + frontend & backend
```

The system automatically handles port conflicts by:
1. Detecting available ports for the backend (trying 5000, 5001, 5002, etc.)
2. Automatically configuring the frontend to communicate with whichever port the backend uses
3. Setting the `NEXT_PUBLIC_API_URL` environment variable accordingly

## 2. Replit Preview
Replit’s built‐in Secrets Manager injects key/value pairs as real environment variables (`process.env`).

1. Open your Replit project and add these secrets (same keys as above).
2. Omit the local JSON file — `load-secrets` will skip JSON loading and still write an `.env` for tools that need it.
3. Start the app:
   ```bash
   npm run dev
   ```
   Your code (`process.env.SUPABASE_URL`, etc.) consumes Replit’s env vars automatically.

## 3. Production (Vercel + Supabase)
In production we rely on real environment variables supplied by Vercel (and Supabase) rather than JSON files.

### 3.1 Vercel Configuration
1. In the Vercel dashboard for this project, go to **Settings → Environment Variables**.
2. Add the same keys:
   - `POSTGRES_PASSWORD`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - (optionally) `OPENAI_API_KEY`
3. Deploy — Vercel will make these values available at build time and runtime to Next.js and serverless functions.

### 3.2 Supabase Migrations
- Ensure `supabase/config.toml` reads from `process.env` or from `./supabase/.env` if running locally.
- In CI/CD or manual migrations, set env vars accordingly and run:
  ```bash
  npm run supabase:push
  ```

## 4. Required Environment Variables

The following environment variables are required for the application to function properly:

### Supabase Configuration
- `POSTGRES_PASSWORD` - Password for local Supabase PostgreSQL instance
- `SUPABASE_URL` - URL for Supabase API access
- `SUPABASE_ANON_KEY` - Anonymous/public API key for Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Same as SUPABASE_URL, but accessible in frontend code
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Same as SUPABASE_ANON_KEY, but accessible in frontend code

### Email Configuration
- `SMTP_HOST` - SMTP server host (default: sandbox.smtp.mailtrap.io for development)
- `SMTP_PORT` - SMTP server port (default: 587)
- `SMTP_USER` - SMTP username for authentication
- `SMTP_PASS` - SMTP password for authentication

For production (Vercel), you may use Postmark instead of Mailtrap:
- `POSTMARK_SERVER_TOKEN` - Postmark API token (replaces SMTP_USER/SMTP_PASS)
- Production SMTP settings should be configured accordingly

### API Configuration
- `NEXT_PUBLIC_API_URL` - URL to access the backend API (automatically set by load-secrets script)
- `OPENAI_API_KEY` - Optional API key for OpenAI services if used

## 5. Best Practices
- **Never commit** secrets to Git — secrets files and `.env*` should be in `.gitignore`.
- For any frontend config that must be exposed, use the `NEXT_PUBLIC_` prefix.
- After updating your local `secrets.json`, re-run `npm run load-secrets`.
- Rotate secrets by updating the source (JSON, Replit, or Vercel) and redeploy/restart.
- Run `npm run security:scan` before committing to ensure no secrets are accidentally included in your code.

---
