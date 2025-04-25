# Phase 3A: Checklist & Step-by-Step Process

## Step 1: Review System Issues
- [ ] Open `project-verification/phases/phase3a/system-issues.md` and confirm the migration conflict root causes.

## Step 2: Choose Remediation Path
- [ ] **Option A:** Idempotent fix using `DROP POLICY IF EXISTS` guards.
- [ ] **Option B:** Repair or squash migration history to remove duplicate `CREATE POLICY` statements.

## Step 3: Apply Fix
- [ ] Edit `20250424120000_add_indexes_and_policies.sql` (and other affected migrations).
  - For Option A: prepend `DROP POLICY IF EXISTS ...` before each `CREATE POLICY`.
  - For Option B: remove duplicate `CREATE POLICY` lines or squash into original migration.
- [ ] Commit the changes.

## Step 4: Test Local Migration Push
- [ ] Run migrations against the local emulator without prompt:
  ```bash
  npm run supabase:push:local
  ```
- [ ] Confirm no `ERROR 42710` or other policy conflicts appear.

## Step 5: Validate Local Schema & Policies
- [ ] In psql against `localhost:54322`, verify policies exist exactly once:
  ```sql
  \d+ public.categories
  SELECT policyname FROM pg_policies WHERE tablename = 'categories';
  ```

## Step 6: Test Remote Migration Push
- [ ] Link and push to the remote project:
  ```bash
  npm run supabase:link
  npm run supabase:push
  ```
- [ ] Confirm the prompt and verify migration success.

## Tests for this Phase
- [ ] Local and remote `supabase db push` succeed without errors.
- [ ] No duplicate policy names in any environment.

## Inspection Pass-Gate
1. Migration errors are fully resolved locally and remotely.
2. Migrations are idempotent and replayable from scratch.
3. Policies exist exactly once per table in both dev and prod.