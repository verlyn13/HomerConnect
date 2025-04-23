**Key Principle:** Subtasks should represent a single, verifiable action (e.g., "Create file X", "Implement function Y", "Configure setting Z"). Human input will be required for design choices, complex logic, final approvals, and strategic decisions.

---

## Community Calendar Implementation Plan (Detailed Subtasks)

**Project:** Community Calendar Website with User Management & AI Input
**Architecture:** Modular Monolith (Node.js/TS Backend, e.g., NestJS), Next.js Frontend, Supabase (Auth, DB, Storage, pgvector), OpenAI APIs (Whisper, GPT-4o), Docker Deployment (Fly.io/Railway).
**Target Users:** Non-technical community members.
**Priority:** Ease-of-use, maintainability, robust core functionality (MVP), innovative AI input.

---

### Implementation Stages & Tasks (with Subtasks)

**Effort Key:** XS (<1hr), S (1-3 hrs), M (3-8 hrs), L (1-2 days), XL (2-4 days)

**1. Initialization Stage (Duration: ~0.5 Week)**

* **Goal:** Prepare the project environment, tools, and basic structure.
* **Orchestration:** Most tasks can run in parallel once initial decisions are made. Critical for setting the foundation.
* **Stage Acceptance Criteria:** Project repository exists, core dev tools are installed/configured, basic documentation structure is in place, communication channels are set up.

---

**Task: INIT-01 Setup Project Repository (Effort: S)**

* **INIT-01.1:** **[Human Decision]** Confirm Git hosting platform (Default: GitHub).
* **INIT-01.2:** Create the repository on the chosen platform.
  * *Instructions:* Create a new private repository named `community-calendar-app` (or similar).
  * *Deliverable:* Empty Git repository URL.
  * *Verification:* Repository exists and is accessible.
  * *Effort:* XS
* **INIT-01.3:** Create initial `README.md`.
  * *Instructions:* Add a basic `README.md` with project title, brief description (from project brief), and placeholder sections (Setup, Running Locally, Architecture).
  * *Deliverable:* `README.md` file in the repo root.
  * *Verification:* File exists with specified content.
  * *Effort:* XS
* **INIT-01.4:** Create `.gitignore`.
  * *Instructions:* Generate a standard Node.js `.gitignore` file (e.g., from gitignore.io or template). Add common Next.js and OS-specific ignores (`.DS_Store`, `Thumbs.db`). Add `.env*` (except `.env.example`).
  * *Deliverable:* `.gitignore` file in the repo root.
  * *Verification:* File exists and includes common ignores.
  * *Effort:* XS
* **INIT-01.5:** Clone the repository locally.
  * *Instructions:* `git clone <repo_url>`
  * *Deliverable:* Local copy of the repository.
  * *Verification:* Repository cloned successfully.
  * *Effort:* XS (All Team Members)

**Task: INIT-02 Choose & Setup Dev Tools (Effort: M)**

* **INIT-02.1:** **[Human Decision]** Confirm Node.js version (e.g., LTS 20.x).
* **INIT-02.2:** **[Human Decision]** Confirm package manager (Default: `npm`).
* **INIT-02.3:** Ensure Node.js & chosen package manager are installed.
  * *Instructions:* Team members verify/install the agreed Node.js version (using `nvm` recommended).
  * *Deliverable:* Working Node.js/npm environment.
  * *Verification:* `node -v` and `npm -v` show correct versions.
  * *Effort:* S (All Team Members)
* **INIT-02.4:** Install Docker Desktop.
  * *Instructions:* Team members install Docker Desktop.
  * *Deliverable:* Working Docker environment.
  * *Verification:* `docker --version` runs successfully.
  * *Effort:* S (All Team Members)
* **INIT-02.5:** Document tool versions in `README.md`.
  * *Instructions:* Add the chosen Node.js and package manager versions to the `README.md` Setup section.
  * *Deliverable:* Updated `README.md`.
  * *Verification:* `README.md` reflects correct versions.
  * *Effort:* XS

**Task: INIT-03 Establish Coding Standards (Effort: M)**

* **INIT-03.1:** Initialize `eslint` configuration.
  * *Instructions:* Run `npm init @eslint/config` (or framework-specific equivalent) in both `frontend` and `backend` directories (once created). Choose standard configurations (e.g., Standard/Airbnb-Base + TypeScript).
  * *Deliverable:* `.eslintrc.js` (or similar) config files.
  * *Verification:* Config files generated.
  * *Effort:* S
* **INIT-03.2:** Install & configure `prettier`.
  * *Instructions:* Install `prettier` and `eslint-config-prettier` (to disable conflicting ESLint rules). Create a `.prettierrc.js` file with basic rules (e.g., `semi: true`, `singleQuote: true`, `tabWidth: 2`).
  * *Deliverable:* `.prettierrc.js` file, updated eslint config.
  * *Verification:* Config file exists; `npx prettier --check .` runs.
  * *Effort:* S
* **INIT-03.3:** Add linting/formatting scripts to `package.json`.
  * *Instructions:* Add `lint`, `lint:fix`, `format:check`, `format:write` scripts to `package.json` files (frontend/backend).
  * *Deliverable:* Updated `package.json` files.
  * *Verification:* Scripts run correctly (`npm run lint`, etc.).
  * *Effort:* S
* **INIT-03.4:** Create `CONTRIBUTING.md`.
  * *Instructions:* Create a basic `CONTRIBUTING.md` outlining branch naming conventions (e.g., `feat/`, `fix/`, `chore/`), commit message format (e.g., Conventional Commits), and the requirement to run linters before pushing.
  * *Deliverable:* `CONTRIBUTING.md` file.
  * *Verification:* File exists with contribution guidelines.
  * *Effort:* S

**Task: INIT-04 Setup Communication Channels (Effort: S)**

* **INIT-04.1:** Create Slack/Discord channel(s).
  * *Instructions:* Create `#community-calendar-dev` channel.
  * *Deliverable:* Communication channel.
  * *Verification:* Team members invited and can post.
  * *Effort:* XS
* **INIT-04.2:** **[Human Decision]** Choose Project Management Tool (Default: Trello/GitHub Projects).
* **INIT-04.3:** Setup Project Management Board.
  * *Instructions:* Create a board with initial columns (Backlog, To Do, In Progress, Review, Done) based on the stages defined in this plan. Add high-level tasks (stages) initially.
  * *Deliverable:* Project board URL.
  * *Verification:* Board is accessible; initial structure is present.
  * *Effort:* S

**Task: INIT-05 Documentation Framework Setup (Effort: S)**

* **INIT-05.1:** **[Human Decision]** Choose documentation location (Default: `/docs` folder within the main repo using Markdown).
* **INIT-05.2:** Create initial documentation structure.
  * *Instructions:* Create a `/docs` directory. Add placeholder files: `architecture.md`, `user-guide.md`, `admin-guide.md`, `setup.md`.
  * *Deliverable:* `/docs` directory with placeholder files.
  * *Verification:* Directory and files exist.
  * *Effort:* XS
* **INIT-05.3:** Update `README.md` linking to `/docs`.
  * *Instructions:* Add links in the `README.md` pointing to the key documents in the `/docs` folder.
  * *Deliverable:* Updated `README.md`.
  * *Verification:* Links work correctly.
  * *Effort:* XS

**Task: INIT-06 Setup Supabase Project (Effort: S)**

* **INIT-06.1:** Create a new Supabase project.
  * *Instructions:* Go to supabase.com, create a new project (e.g., `community-calendar-dev`), choose region, set a strong DB password (save securely!).
  * *Deliverable:* Supabase project dashboard access.
  * *Verification:* Project exists in the Supabase dashboard.
  * *Effort:* XS
* **INIT-06.2:** Obtain API keys and URL.
  * *Instructions:* Navigate to Project Settings -> API. Copy the Project URL, `anon` key, and `service_role` key.
  * *Deliverable:* API URL and keys (store securely, e.g., password manager).
  * *Verification:* Keys and URL are available.
  * *Effort:* XS
* **INIT-06.3:** Configure team access.
  * *Instructions:* Invite necessary team members via Supabase dashboard (Settings -> Team).
  * *Deliverable:* Team members have access.
  * *Verification:* Team members confirm they can log in to the Supabase project dashboard.
  * *Effort:* XS
* **INIT-06.4:** Create `.env.example` files.
  * *Instructions:* Create `.env.example` in both `frontend` and `backend` roots (once created). Add placeholders for `SUPABASE_URL` and `SUPABASE_ANON_KEY` (frontend) and `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (backend).
  * *Deliverable:* `.env.example` files.
  * *Verification:* Files exist with correct placeholders.
  * *Effort:* S

---

**2. Foundation Stage (Duration: ~1.5-2 Weeks)**

* **Goal:** Implement the core system architecture, database structure, basic authentication, and development environment.
* **Orchestration:** Backend and Frontend setup can run in parallel initially. DB schema design is critical path for backend development.
* **Checkpoint:** Review DB Schema, Backend Module Structure, Basic Auth Flow.
* **Stage Acceptance Criteria:** Basic Next.js app running, basic Node.js backend running (containerized), DB schema migrated, basic Supabase Auth integration allows user signup/login.

---

**Task: FND-01 Initialize Next.js Frontend App (Effort: M)**

* **FND-01.1:** Create monorepo structure (Optional but recommended).
  * *Instructions:* Create root `package.json`, `apps/` folder. Decide on monorepo tool (npm workspaces, pnpm, Turborepo). Setup basic workspace config.
  * *Deliverable:* Root `package.json`, `apps/` folder.
  * *Verification:* Workspace structure established.
  * *Effort:* S
* **FND-01.2:** Create Next.js project.
  * *Instructions:* Run `npx create-next-app@latest apps/frontend --ts` (or similar) using App Router.
  * *Deliverable:* `apps/frontend` directory with Next.js project files.
  * *Verification:* Project created successfully.
  * *Effort:* XS
* **FND-01.3:** Configure base TypeScript settings (`tsconfig.json`).
  * *Instructions:* Review and adjust `apps/frontend/tsconfig.json` for strictness and path aliases (e.g., `@/*`).
  * *Deliverable:* Updated `tsconfig.json`.
  * *Verification:* `npm run build` (or equivalent) passes type checks.
  * *Effort:* XS
* **FND-01.4:** **[Human Decision]** Choose UI Library (e.g., Shadcn/ui, MUI, Mantine).
* **FND-01.5:** Install and configure chosen UI Library.
  * *Instructions:* Follow the library's installation guide (e.g., `npx shadcn-ui@latest init`). Install necessary base components (Button, Input, Card).
  * *Deliverable:* UI Library integrated.
  * *Verification:* UI library components can be imported and rendered without errors.
  * *Effort:* S
* **FND-01.6:** Create basic layout file (`layout.tsx`).
  * *Instructions:* Define the root layout in `apps/frontend/app/layout.tsx` including basic HTML structure, body tags, and potentially a placeholder header/footer.
  * *Deliverable:* `layout.tsx`.
  * *Verification:* Basic layout structure applied to pages.
  * *Effort:* XS
* **FND-01.7:** Create basic landing page (`page.tsx`).
  * *Instructions:* Create a simple landing page at `apps/frontend/app/page.tsx` displaying "Community Calendar".
  * *Deliverable:* `page.tsx`.
  * *Verification:* Running `npm run dev` in `apps/frontend` shows the landing page.
  * *Effort:* XS

**Task: FND-02 Initialize Node.js Backend App (Effort: M)**

* **FND-02.1:** **[Human Decision]** Confirm backend framework (Default: NestJS).
* **FND-02.2:** Create NestJS project.
  * *Instructions:* Run `nest new apps/backend` (adjust path if using monorepo). Choose package manager.
  * *Deliverable:* `apps/backend` directory with NestJS project files.
  * *Verification:* Project created successfully.
  * *Effort:* XS
* **FND-02.3:** Configure base TypeScript settings (`tsconfig.json`).
  * *Instructions:* Review and adjust `apps/backend/tsconfig.json` and `tsconfig.build.json`.
  * *Deliverable:* Updated tsconfig files.
  * *Verification:* `npm run build` passes type checks.
  * *Effort:* XS
* **FND-02.4:** Implement basic health check endpoint.
  * *Instructions:* In `AppController` (or a new `HealthController`), create a GET `/health` endpoint that returns `{"status": "ok"}` and HTTP 200.
  * *Deliverable:* `health.controller.ts` or updated `app.controller.ts`.
  * *Verification:* Running `npm run start:dev` and accessing `http://localhost:3001/health` (or configured port) returns the expected JSON response.
  * *Effort:* S

**Task: FND-03 Design Initial Database Schema (Effort: L)**

* **FND-03.1:** Define `users` / `profiles` relationship.
  * *Instructions:* Design `profiles` table linked one-to-one with `auth.users` (using user ID as FK/PK). Include fields: `id` (UUID, FK to auth.users), `username` (unique, text), `full_name` (text), `avatar_url` (text, nullable), `bio` (text, nullable), `created_at`, `updated_at`.
  * *Deliverable:* Schema definition for `profiles`.
  * *Verification:* Schema reviewed and covers basic profile needs.
  * *Effort:* S
* **FND-03.2:** Define `events` table.
  * *Instructions:* Design `events` table: `id` (UUID, PK), `title` (text, not null), `description` (text, nullable), `start_time` (timestamptz, not null), `end_time` (timestamptz, nullable), `location_text` (text, nullable), `location_geo` (geography point, nullable), `created_by` (UUID, FK to auth.users, not null), `created_at`, `updated_at`. Consider adding `category_id` (FK), `image_url` (text, nullable).
  * *Deliverable:* Schema definition for `events`.
  * *Verification:* Schema reviewed and covers basic event needs.
  * *Effort:* M
* **FND-03.3:** Define `categories` table (optional, simple first).
  * *Instructions:* Design `categories` table: `id` (serial, PK), `name` (text, unique, not null).
  * *Deliverable:* Schema definition for `categories`.
  * *Verification:* Schema reviewed.
  * *Effort:* XS
* **FND-03.4:** Define `tags` table (optional, simple first).
  * *Instructions:* Design `tags` table: `id` (serial, PK), `name` (text, unique, not null).
  * *Deliverable:* Schema definition for `tags`.
  * *Verification:* Schema reviewed.
  * *Effort:* XS
* **FND-03.5:** Define `event_tags` join table (if using tags).
  * *Instructions:* Design `event_tags` table: `event_id` (UUID, FK to events), `tag_id` (int, FK to tags), Primary Key (`event_id`, `tag_id`).
  * *Deliverable:* Schema definition for `event_tags`.
  * *Verification:* Schema reviewed.
  * *Effort:* XS
* **FND-03.6:** Define `event_rsvps` table.
  * *Instructions:* Design `event_rsvps` table: `event_id` (UUID, FK to events), `user_id` (UUID, FK to auth.users), `rsvp_status` (enum/text: 'yes', 'no', 'maybe'), `created_at`, Primary Key (`event_id`, `user_id`).
  * *Deliverable:* Schema definition for `event_rsvps`.
  * *Verification:* Schema reviewed.
  * *Effort:* S
* **FND-03.7:** **[Human Review]** Final review and approval of the complete initial schema diagram/definition by the team.
  * *Instructions:* Document the schema using a tool (like dbdiagram.io) or markdown. Hold a review meeting.
  * *Deliverable:* Approved schema documentation.
  * *Verification:* Team consensus reached.
  * *Effort:* M

**Task: FND-04 Implement & Migrate DB Schema (Effort: M)**

* **FND-04.1:** Setup Supabase CLI and link project.
  * *Instructions:* Install Supabase CLI (`npm i -g supabase`). Run `supabase login`. Run `supabase link --project-ref <your-project-ref>` inside `apps/backend` (or a dedicated `/supabase` folder). Run `supabase init` if starting fresh locally (optional).
  * *Deliverable:* Supabase CLI configured and linked.
  * *Verification:* `supabase status` shows linked project.
  * *Effort:* S
* **FND-04.2:** Create initial schema migration file.
  * *Instructions:* Run `supabase migration new initial_schema`.
  * *Deliverable:* New SQL migration file created in `supabase/migrations`.
  * *Verification:* File exists with timestamped name.
  * *Effort:* XS
* **FND-04.3:** Write SQL for `profiles` table in migration file.
  * *Instructions:* Add `CREATE TABLE profiles...` SQL based on FND-03.1 design. Include constraint for FK to `auth.users`.
  * *Deliverable:* Updated migration SQL file.
  * *Verification:* SQL syntax is valid.
  * *Effort:* S
* **FND-04.4:** Write SQL for `events`, `categories`, `tags`, `event_tags`, `event_rsvps` tables in migration file.
  * *Instructions:* Add `CREATE TABLE...` statements for remaining tables based on FND-03 design, including necessary FKs and constraints.
  * *Deliverable:* Updated migration SQL file.
  * *Verification:* SQL syntax is valid.
  * *Effort:* M
* **FND-04.5:** Apply migration to local/dev Supabase instance.
  * *Instructions:* Run `supabase db push` (if using remote dev) or `supabase start` & `supabase migration up` (if using local Docker).
  * *Deliverable:* Schema applied to the database.
  * *Verification:* Tables visible in Supabase Studio (SQL Editor or Table Editor); No errors during migration.
  * *Effort:* S
* **FND-04.6:** Implement DB function/trigger to auto-create profile on signup.
  * *Instructions:* Write SQL function `handle_new_user()` that inserts into `profiles` using `NEW.id` from `auth.users`. Create trigger `on_auth_user_created` that calls the function after insert on `auth.users`. Add this SQL to a new migration file (`supabase migration new setup_profile_trigger`). Apply migration.
  * *Deliverable:* Migration file with function/trigger; Trigger active in DB.
  * *Verification:* Creating a new user via Supabase Auth UI results in a corresponding row in the `profiles` table.
  * *Effort:* M

**Task: FND-05 Setup Basic Supabase Auth Integration (Effort: M)**

* **FND-05.1:** Enable Email/Password Auth Provider in Supabase.
  * *Instructions:* In Supabase Dashboard -> Authentication -> Providers, enable the 'Email' provider. Configure settings (e.g., disable confirmation for dev initially).
  * *Deliverable:* Email provider enabled.
  * *Verification:* Setting is saved in Supabase dashboard.
  * *Effort:* XS
* **FND-05.2:** Write initial Row Level Security (RLS) policy for `profiles`.
  * *Instructions:* In Supabase Studio -> SQL Editor, enable RLS for `profiles`. Create policies: Allow users to SELECT/UPDATE their own profile (`auth.uid() = id`). Allow logged-in users to SELECT any profile (adjust later if needed). Add SQL to a new migration file (`supabase migration new rls_policies`). Apply migration.
  * *Deliverable:* Migration file with RLS policies; RLS enabled on `profiles`.
  * *Verification:* Policies visible in Supabase Studio -> Authentication -> Policies. Basic access control works as expected (test via SQL Editor `set role authenticated; select * from profiles;`).
  * *Effort:* M
* **FND-05.3:** Write initial RLS policy for `events`.
  * *Instructions:* Enable RLS for `events`. Create policies: Allow public SELECT access. Allow logged-in users to INSERT. Allow users to UPDATE/DELETE their own events (`auth.uid() = created_by`). Add to RLS migration file. Apply.
  * *Deliverable:* Updated RLS migration file.
  * *Verification:* Policies visible and basic access control works.
  * *Effort:* M

**Task: FND-06 Implement Basic Frontend Auth Flow (Effort: L)**

* **FND-06.1:** Install Supabase JS client library.
  * *Instructions:* In `apps/frontend`, run `npm install @supabase/supabase-js`.
  * *Deliverable:* Library installed.
  * *Verification:* Listed in `package.json`.
  * *Effort:* XS
* **FND-06.2:** Create Supabase client instance utility.
  * *Instructions:* Create `lib/supabase/client.ts`. Initialize and export a Supabase client using environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Ensure it's configured for Browser usage.
  * *Deliverable:* `lib/supabase/client.ts`.
  * *Verification:* Client can be imported and used.
  * *Effort:* S
* **FND-06.3:** Create simple Signup page/component.
  * *Instructions:* Create `/signup` route. Add a form with email/password fields. On submit, call `supabase.auth.signUp()`. Handle loading state and display errors/success messages. Redirect on success.
  * *Deliverable:* Signup page/component (`app/signup/page.tsx`, components).
  * *Verification:* User can enter details and successfully create an account in Supabase (check Auth -> Users). Errors are displayed.
  * *Effort:* M
* **FND-06.4:** Create simple Login page/component.
  * *Instructions:* Create `/login` route. Add a form with email/password fields. On submit, call `supabase.auth.signInWithPassword()`. Handle loading state and display errors/success messages. Redirect on success (e.g., to homepage).
  * *Deliverable:* Login page/component (`app/login/page.tsx`, components).
  * *Verification:* Existing user can log in. Session cookie is set. Errors are displayed.
  * *Effort:* M
* **FND-06.5:** Implement Logout functionality.
  * *Instructions:* Add a Logout button (e.g., in header). On click, call `supabase.auth.signOut()`. Redirect to login or home page.
  * *Deliverable:* Logout button/action.
  * *Verification:* Clicking logout clears the session and redirects.
  * *Effort:* S
* **FND-06.6:** Implement basic Auth state management.
  * *Instructions:* Use React Context or a state management library (Zustand, Jotai) to track the current user session/profile globally. Listen to `supabase.auth.onAuthStateChange`. Make user info available throughout the app. Protect routes/show different UI based on auth state.
  * *Deliverable:* Auth context/store; Updated layout/components using auth state.
  * *Verification:* UI correctly reflects logged-in/logged-out state; User data accessible where needed. Protected pages redirect unauthenticated users.
  * *Effort:* L

**Task: FND-07 Define Backend Module Structure (Effort: S)**

* **FND-07.1:** Create base module folders in backend.
  * *Instructions:* Inside `apps/backend/src`, create folders: `core` (shared utils, configs), `auth` (auth-related logic if extending Supabase), `event`, `user` (profiles), `ai`, `search`.
  * *Deliverable:* Directory structure.
  * *Verification:* Folders exist.
  * *Effort:* XS
* **FND-07.2:** Create initial module files for each feature area (NestJS).
  * *Instructions:* Use Nest CLI (`nest g module <name>`, `nest g controller <name> --no-spec`, `nest g service <name> --no-spec`) to generate basic `*.module.ts`, `*.controller.ts`, `*.service.ts` for `event`, `user`, `ai`, `search`.
  * *Deliverable:* Basic module files generated.
  * *Verification:* Files exist; App module imports new feature modules.
  * *Effort:* S
* **FND-07.3:** **[Human Review]** Review the proposed module structure for logical separation of concerns.
  * *Instructions:* Discuss if the structure aligns with the modular monolith goals.
  * *Deliverable:* Approved module structure.
  * *Verification:* Team agreement.
  * *Effort:* XS

**Task: FND-08 Dockerize Backend for Development (Effort: M)**

* **FND-08.1:** Create backend `Dockerfile`.
  * *Instructions:* Create `apps/backend/Dockerfile`. Use a Node.js base image (match agreed version). Set WORKDIR. Copy `package*.json`. Run `npm install`. Copy source code. Expose port (e.g., 3001). Set CMD to run the app (`npm run start:dev`). Implement multi-stage build for smaller production image later.
  * *Deliverable:* `apps/backend/Dockerfile`.
  * *Verification:* Dockerfile created with necessary instructions.
  * *Effort:* S
* **FND-08.2:** Create `.dockerignore` file.
  * *Instructions:* Create `apps/backend/.dockerignore`. Add `node_modules`, `dist`, `.env`, `Dockerfile`.
  * *Deliverable:* `apps/backend/.dockerignore`.
  * *Verification:* File exists with standard ignores.
  * *Effort:* XS
* **FND-08.3:** Create `docker-compose.yml` at the repo root.
  * *Instructions:* Define a service named `backend`. Use `build: ./apps/backend`. Map ports (e.g., `3001:3001`). Mount volumes for code (`./apps/backend:/app`) and node_modules (`/app/node_modules`) for hot-reloading. Add `env_file: ./apps/backend/.env`. (Note: Don't include DB service if using remote Supabase).
  * *Deliverable:* Root `docker-compose.yml`.
  * *Verification:* File exists with backend service definition.
  * *Effort:* S
* **FND-08.4:** Create development `.env` file for backend.
  * *Instructions:* Copy `apps/backend/.env.example` to `apps/backend/.env`. Fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` obtained in INIT-06.
  * *Deliverable:* `apps/backend/.env` file (ensure it's gitignored).
  * *Verification:* File exists with credentials.
  * *Effort:* XS
* **FND-08.5:** Test Docker setup.
  * *Instructions:* Run `docker-compose up --build` from the repo root.
  * *Deliverable:* Running backend container.
  * *Verification:* Container starts without errors; `/health` endpoint is accessible via mapped port (e.g., `localhost:3001/health`). Changes to backend code trigger restart/reload.
  * *Effort:* S

**(Continue breaking down Stages 3-8 in this manner, focusing on small, verifiable steps and identifying human decision/review points.)**

---

*Self-Correction/Refinement during thought process:*

* Initially, I might make subtasks too large (e.g., "Implement Event CRUD"). Need to break that down further (Implement GET endpoint, Implement POST endpoint, Implement Service logic for POST, etc.).
* Ensure verification steps are concrete (e.g., not just "It works", but "API call returns 200 OK with expected data structure").
* Explicitly add subtasks for installing dependencies (`npm install X`).
* Add subtasks for creating basic files (`*.ts`, `*.tsx`, `*.css`) before implementing logic within them.
* Call out specific configurations needed (e.g., setting environment variables, configuring Supabase providers).
* Remember to add human review points after significant design/implementation steps (DB schema, module structure, critical logic).
* Ensure dependencies between subtasks are clear (e.g., can't implement frontend auth component before Supabase client is set up).

This level of granularity makes tasks clearer for individual execution and allows for better tracking and potential automation assistance.
