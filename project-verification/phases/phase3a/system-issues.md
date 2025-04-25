### Current Progress Report — **Migration/Policy Conflict & Immediate Remediation**

**Date:** 2025-04-25
**Context:** `supabase db push --local` aborts on `ERROR 42710 (policy "...already exists")` while applying `20250424120000_add_indexes_and_policies.sql`.

---

#### 1  What’s *actually* broken

| Symptom | Root cause | Proof |
|---------|------------|-------|
| `ERROR 42710` on every duplicate `CREATE POLICY … ON public.categories` | PostgreSQL policy names are **unique per-table**. Attempting to create a policy that already exists is a hard error. PostgreSQL still **does not provide `IF NOT EXISTS`** for `CREATE POLICY`, so your defensive clauses were silently stripped when you removed them | PostgreSQL docs list no `IF NOT EXISTS` syntax, and state “The name of the policy must be distinct from the name of any other policy for the table.”  ([PostgreSQL: Documentation: 17: CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html)) |
| The failing migration file *re-creates* every policy that was already created in the initial schema migration | You generated a second “fix” migration instead of altering or dropping the originals, so the same `CREATE POLICY` commands run twice | Error appears on first duplicate policy; the rest are skipped because the whole transaction is aborted |

---

#### 2  Stop-the-bleed fix (local **and** remote)

> **Pick one — don’t do both.**

| Option | When to use | Steps |
|--------|-------------|-------|
| **A. Make the migration idempotent** (fast) | You’re fine re-running migrations locally & don’t care about a messy history | 1. Edit `20250424120000_add_indexes_and_policies.sql` (and any later file that creates policies).<br>2. **Prepend** a guard for every policy:<br>```sql\nDROP POLICY IF EXISTS \"Public categories are viewable by everyone\" ON public.categories;\nCREATE POLICY \"Public categories are viewable by everyone\"\n  ON public.categories FOR SELECT USING (true);\n```<br>3. Re-run `npm run supabase:push:local`. |
| **B. Re-base / repair history** (clean) | You want a sane migration chain & avoid running unnecessary SQL in prod | 1. Delete the duplicate `CREATE POLICY` statements from `20250424120000_add_indexes_and_policies.sql` **or** squash that file into the original schema migration.<br>2. Run `supabase migration repair --version 20250424120000_add_indexes_and_policies.sql --status reverted` to mark the bad file *reverted* on the remote history  ([CLI Reference | Supabase Docs](<https://supabase.com/docs/reference/cli/introduction?utm_source=chatgpt.com>)).<br>3. Commit the cleaned migrations and `supabase db push`. |

Either path unblocks the push; **don’t leave both the drop-and-create and the original create in separate files** or you’ll just chase your tail next time.

---

#### 3  Structural remediation (do **this** or you’ll be back here)

1. **One-time objects live in one migration.** Once a policy/table/trigger exists, later migrations should only **ALTER** or **DROP … CREATE**, never blindly `CREATE` again.
2. Wrap anything you might re-run in a *DO block* if idempotence matters, e.g.

   ```sql
   DO $$
   BEGIN
     IF NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public'
       AND tablename  = 'categories'
       AND policyname = 'Public categories are viewable by everyone'
     ) THEN
       CREATE POLICY "Public categories are viewable by everyone"
       ON public.categories FOR SELECT USING (true);
     END IF;
   END$$;
   ```

   (Yes, it’s verbose; PostgreSQL gives you no shortcut.)
3. **CI check:** run `supabase db reset && supabase db push` in CI to prove migrations are replayable from scratch.
4. **Preview branches:** use Supabase preview branches or a shadow DB to test every PR migration before merge.
5. **Migration naming discipline:** prefix each file with an action (`create_`, `alter_`, `drop_`) so reviewers instantly catch accidental duplicates.

---

#### 4  Loose ends you still need to fix

| Area | Issue | Risk |
|------|-------|------|
| `minimum_password_length` now 8 in `config.toml`, but your backend `ProfilesService` still validates length ≥ 6 | Users can create passwords that backend later rejects (or vice-versa) | Update backend validator to 8 |
| `inbucket.enabled` still `true` on remote (you only changed local file) | Dev email previews leak in prod, SMTP double-sends | After migrations succeed, run `supabase secrets set …` then `supabase db reload config` |
| Multiple `.env.*` files with overlapping Supabase vars | Easy to mis-set prod creds locally | Standardise: root `.env`, dotenv-expand, no APP sub-env overrides |

---

#### 5  If this still fails…

* Run with `--debug` to confirm which policy hits first.
* If the migration partly applied before the crash, *manually* `DROP POLICY` for the offending table in psql, then re-run push.
* Worst-case local: `supabase db reset` to rebuild from a clean slate; remote: repair history as shown above.

---

### Bottom line

Your migrations are **duplicating objects** because you’re re-creating instead of altering. Clean up the offending SQL or mark it as applied, enforce idempotent patterns going forward, and wire CI to catch this class of error before it ever reaches `supabase db push`.
