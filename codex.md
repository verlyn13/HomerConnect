# codex Configuration for Community Calendar Monorepo

This file provides project metadata and commands for Codex CLI to facilitate development across frontend, backend, and Supabase components.

## Project Structure

- `package.json` (root): workspace scripts, dependencies, and Supabase commands.
- `apps/frontend/`: Next.js application (TypeScript, Tailwind CSS).
- `apps/backend/`: NestJS application (TypeScript).
- `supabase/`: Supabase project files (migrations, functions).
- `scripts/`: helper scripts (e.g., `load_secrets.sh`).
- Documentation:
  - `README.md`: primary project overview and setup.
  - `implementation.md`: detailed implementation progress plan.
  - `orchestration.md`: high-level orchestration and stage breakdown.
  - `status.md`: project status summary.
  - `replit-workflow-guide.md`: Replit-specific workflow notes.

## Root CLI Commands

Use these commands from the repository root:

- `npm run load-secrets` / `npm run predev`
  Load environment secrets into `.env` files for both apps and Supabase.
- `npm run dev`
  Starts frontend (`apps/frontend`) and backend (`apps/backend`) concurrently.
- `npm run supabase:start`
  Launches the local Supabase emulator.
- `npm run supabase:link`
  Links Supabase CLI to the project using configured secrets.
- `npm run supabase:push`
  Applies database migrations via Supabase CLI.

## Frontend Commands (`apps/frontend`)

- `npm run dev`
  Start Next.js in development mode.
- `npm run build`
  Build production Next.js assets.
- `npm run lint`
  Run ESLint across frontend code.
- `npm run format`
  Run Prettier to format code.

## Backend Commands (`apps/backend`)

- `npm run start:dev`
  Start NestJS in watch mode.
- `npm run build`
  Compile TypeScript to JavaScript.
- `npm run test`
  Execute unit tests with Jest.
- `npm run test:e2e`
  Run end-to-end tests.
- `npm run lint`
  Run ESLint across backend code.
- `npm run format`
  Run Prettier to format code.

## Testing & CI Recommendations

- Unit tests: `apps/backend/src/**/*.spec.ts`.
- E2E tests: `apps/backend/test/**/*.ts`.
- In CI pipelines:
  1. Run `npm run load-secrets`.
  2. Start Supabase emulator (`npm run supabase:start`).
  3. Run `npm run build && npm run test && npm run lint`.
  4. Stop emulator (`npm run supabase:stop`).

## Coding Guidelines

- Adhere to existing ESLint and Prettier configurations.
- Prefer TypeScript for new code and modules.
- Write meaningful unit tests for services and controllers.
- For frontend, consider adding integration tests (e.g., Cypress) once basic flows are stable.
- Keep inline comments minimal; use documentation files for detailed explanations.

## Documentation & Workflow

- Refer to `implementation.md` for the current task list and progress.
- Refer to `orchestration.md` for stage orchestration and critical paths.
- Update `README.md` or create a `docs/` folder for feature-specific documentation.

## Codex CLI Context

- Codex CLI automatically includes this `codex.md` for context.
- To include additional docs manually, pass:
  `--project-doc implementation.md`
  `--project-doc orchestration.md`
- Avoid using `--full-context` due to large repository size.
- Exclude large or auto-generated directories: `node_modules/`, `supabase_2.22.4_linux_amd64.rpm`, `attached_assets/`.
