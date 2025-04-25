
# HomerConnect

A community calendar platform for Homer, Alaska that enables grassroots organizing and community engagement.

## Overview

- **Mission:** Enable grassroots organizing through a modern Event Calendar MVP
- **Core Values:** Community-first, privacy-respecting, accessible, transparent
- **Target Audience:** Residents of Homer, AK; community organizers; local non-profits

## Tech Stack

- Frontend: Next.js + React (TypeScript)
- Backend: Node.js + TypeScript
- Database: Supabase (PostgreSQL)
- Hosting: Railway

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/HomerConnect.git
   cd HomerConnect
   ```

2. **Configure secrets:**
   Create a secrets file at `~/.secrets/HomerConnect/secrets.json` with the following structure:
   ```json
   {
     "POSTGRES_PASSWORD": "your_password_here",
     "SUPABASE_URL": "your_supabase_url",
     "SUPABASE_ANON_KEY": "your_anon_key",
     "OPENAI_API_KEY": "your_openai_key_if_used"
   }
   ```

3. **Initialize the project:**
   ```bash
   bash scripts/init.sh
   ```

4. **Start Supabase:**
   ```bash
   npm run supabase:start
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```

## Development Commands

- `npm run dev` - Start both frontend and backend servers
- `npm run supabase:start` - Start Supabase local development
- `npm run supabase:stop` - Stop Supabase local development
- `npm run load-secrets` - Manually refresh environment variables from secrets.json
- `npm run supabase:link` - Link to remote Supabase project (using secret password)
- `npm run supabase:push` - Push local migrations to remote database

## Environment Variables

### Setup

Environment variables are automatically loaded from `~/.secrets/HomerConnect/secrets.json` into `.env` files and the environment when you run development commands.

1. Copy the example environment files:
   ```bash
   cp .env.example .env
   cp supabase/.env.example supabase/.env
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```

2. Update the values in these files with your actual credentials.

### Security Best Practices

To prevent accidental exposure of secrets:

1. **Never commit environment files** - All `.env` files are listed in `.gitignore`.
2. **Store sensitive data outside the repository** - Use `~/.secrets/HomerConnect/secrets.json` for local development.
3. **Use environment variables in CI/CD** - Configure secrets in GitHub Actions or your deployment platform.
4. **Rotate credentials regularly** - Especially for production services.
5. **Use different credentials** for development and production environments.
6. **Use pre-commit hooks** - These automatically detect secrets before they are committed.

#### Secret Detection Hooks

The repository is configured with pre-commit hooks that scan for accidentally committed secrets:

- **Setup**: `npm run security:setup` - Install and configure pre-commit hooks
- **Scan**: `npm run security:scan` - Run standard secret detection
- **Custom Scan**: `npm run security:scan-custom` - Run scan ignoring npm integrity hashes
- **Audit**: `npm run security:audit` - Review detected secrets and mark false positives
- **Toggle**: `npm run security:toggle-hooks` - Temporarily disable/enable hooks

**Handling False Positives:**
- For npm integrity hashes: These are automatically ignored with custom filters
- For other false positives: Run `npm run security:audit` and mark them as non-secrets (answer 'n' when prompted)
- For bulk operations: Temporarily disable hooks with `npm run security:toggle-hooks`

If you accidentally commit sensitive information, see `docs/security-incident-response.md` for remediation steps.

## Documentation

All supplementary documentation is located in the `docs/` directory:

- `docs/implementation.md`: detailed implementation progress plan.
- `docs/orchestration.md`: high-level orchestration and stage breakdown.
- `docs/status.md`: project status summary.
- `docs/replit-workflow-guide.md`: Replit-specific workflow notes.
- Email configuration docs (in `docs/email/`):
  - `email-plan.md`
  - `email-setup.md`
  - `mailtrap.md`
  - `postmark-production.md`

## License

- Backend/AI: AGPL-3.0
- Frontend: MIT
 - Documentation: CC BY-SA 4.0

## Recent Updates

- Fixed hydration warnings by using suppressHydrationWarning and CleanCz component.
- Added CORS headers in next.config.js for static media (fonts, SVGs, icons).
- Corrected invalid CSS declarations and vendor prefixes; removed unsupported properties.
- Ensured image aspect ratios by using Next.js Image or CSS (h-auto alongside width).
- Disabled unnecessary font preloading in Inter font config.
- Aligned ESLint config with Next.js version; fixed JSX entity escaping.
- Verified clean build and lint passes with no errors.
