# Phase 0: Checklist & Step-by-Step Process

## Step-by-Step Initial Assessment

### 1. Codebase Scan

- [ ] Navigate through project directories (root, backend, frontend)
- [ ] Look for folders/files related to auth, user, profile, config, `.env*`
- [ ] Note their presence and location

### 2. Identify Key Libraries

- [ ] Check `package.json` files for libraries related to:
  - [ ] Authentication
  - [ ] Databases
  - [ ] API clients
  - [ ] Example libraries to look for: `@supabase/supabase-js`, `passport`, auth guards, `bcrypt`, `axios`, `node-fetch`

### 3. Attempt Clean Install & Build

- [ ] Run `rm -rf node_modules` (or equivalent)
- [ ] Run your package manager's install command (`npm install`). **Capture exact error output.**
- [ ] Attempt backend build: `cd backend && [package_manager] run build`. **Capture exact error output.**
- [ ] Attempt frontend build: `cd frontend && [package_manager] run build`. **Capture exact error output.**

### 4. Attempt Development Server Start

- [ ] Attempt backend dev server: `cd backend && [package_manager] run start:dev`. **Capture exact error output if it fails.**
- [ ] Attempt frontend dev server: `cd frontend && [package_manager] run dev`. **Capture exact error output if it fails or shows build-related errors in the browser console.**

## Tests for this Phase

- [ ] All commands above were executed
- [ ] All error messages from install, build, and dev server startup attempts were captured verbatim
- [ ] Project structure observations were documented

## Inspection Pass-Gate

To pass this phase, you must have:

1. Confirmed the codebase was committed before starting (with evidence)
2. Captured and documented *every* error encountered during installation, build, and dev server startup attempts
3. Noted key observations about the project structure and libraries
4. Completed the Phase 0 Report with accurate information

Once all checklist items are complete and all tests pass, you can proceed to Phase 1.
