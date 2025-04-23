
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

Environment variables are automatically loaded from `~/.secrets/HomerConnect/secrets.json` into `.env` files and the environment when you run development commands.

## License

- Backend/AI: AGPL-3.0
- Frontend: MIT
- Documentation: CC BY-SA 4.0
