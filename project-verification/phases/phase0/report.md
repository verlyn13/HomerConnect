 # Phase 0 Report: Initial Scan & Errors

 **Date Completed:** 2025-04-25

 ## Environment Information

 | Item              | Output / Observation                                  |
 | :---------------- | :---------------------------------------------------- |
 | Node version      | `v22.12.0`                                            |
 | Package manager   | npm                                                   |
 | Git Status (Pre-0)| See code block below                                  |

 ```bash
 $ git status --porcelain
 ?? auth-issue.md
 ?? docs/environment-setup.md
 ?? env-setup-guide.md
 ?? project-verification.md
 ?? project-verification/
 ?? scripts/commit_no_hooks.sh
 ```

 ## Project Structure Observations

 | Item                | Findings                                                                                  |
 | :------------------ | :---------------------------------------------------------------------------------------- |
 | Key dirs found      | `apps/backend/src/profiles`, `apps/frontend/src/app/profile`, `.env` files in both apps,  \
 |                     | `supabase` folder with migrations and functions                                         |
 | Key libraries ID'd  | Backend: `@nestjs/*`, `@supabase/supabase-js`, `@nestjs-modules/mailer`, `handlebars`,   \
 |                     | `nodemailer`, `dotenv`, `class-validator`, `class-transformer`, `rxjs`                  |
 |                     | Frontend: `next`, `react`, `@supabase/ssr`, `@supabase/supabase-js`, `@tailwindcss/forms`, |
 |                     | `@tailwindcss/typography`, `nodemailer`, `tailwindcss`, `postcss`                        |
 | Project Organization| Monorepo with `apps/frontend`, `apps/backend`, `supabase`; root orchestration scripts    |
 | Auth-related files  | Backend: `profiles` module (controller, service, DTO); Frontend: `src/app/profile` pages, |
 |                     | `components/UserNav.tsx`, `components/ProfileForm.tsx`; `.env` entries for Supabase creds |

 ## Captured Errors

 ### 1. Package Installation

 **Command:** `npm install`

 **Exact Message:**
 ```bash
 npm error code ETARGET
 npm error notarget No matching version found for gitleaks@^8.16.1.
 npm error notarget In most cases you or one of your dependencies are requesting
 npm error notarget a package version that doesn't exist.
 npm error A complete log of this run can be found in: /home/verlyn13/.npm/_logs/2025-04-25T05_41_33_818Z-debug-0.log
 ```
 **Brief Note:** Version mismatch for `gitleaks` in root devDependencies.

 ### 2. Backend Build

 **Command:** `cd apps/backend && npm run build`

 **Exact Message:**
 ```bash
 > backend@0.0.1 build
 > nest build
 ```
 **Brief Note:** Build succeeded without errors.

 ### 3. Frontend Build

 **Command:** `cd apps/frontend && npm run build`

 **Exact Message:**
 ```bash
 > frontend@0.1.0 build
 > next build

   ▲ Next.js 14.2.28
   - Environments: .env.local

    Creating an optimized production build ...
  ✓ Compiled successfully
    Linting and checking validity of types ...
 Failed to compile.

 ./src/app/reset-password/page.tsx:19:7
 Type error: Argument of type '{ email: string; }' is not assignable to parameter of type 'string'.

   19 |       { email },
 ```
 **Brief Note:** Type error in `reset-password` page: incorrect argument for `resetPasswordForEmail`.

 ### 4. Backend Development Server

 **Command:** `cd apps/backend && npm run start:dev`

 **Exact Message:**
 ```bash
 (node:212307) [DEP0040] DeprecationWarning: The `punycode` module is deprecated.
 [Nest] 212307 - 04/24/2025, 9:44:06 PM ERROR [ExceptionHandler] Supabase URL must start with https://
 Error: Supabase URL must start with https://
     at new ProfilesService (apps/backend/src/profiles/profiles.service.ts:18:13)
 ```
 **Brief Note:** Missing or invalid `SUPABASE_URL` environment variable.

 ### 5. Frontend Development Server

 **Command:** `cd apps/frontend && npm run dev`

 **Exact Message:**
 ```bash
 > frontend@0.1.0 dev
 > next dev

  ⚠ Port 3000 is in use, trying 3001 instead.
 ```
 **Brief Note:** Frontend dev server started on port 3001 (port 3000 occupied).

 **Browser Console Screenshot:** To be added during report review.

 ## Summary of Findings

 Captured key errors across installation, build, and startup steps, including dependency version mismatch, missing environment configuration, and type-check failures in the frontend.

 ## Conclusion

 Initial scan complete. Ready to stabilize and fix environment and build issues in Phase 1.
