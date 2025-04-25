# Phase 3A: Migration & Policy Conflict Resolution

## Objective

Ensure Supabase migrations are idempotent and free from duplicate policy errors when running `supabase db push`.

## Key Questions to Answer

- **Q3A.1: Migration Errors:** What specific migration conflicts (e.g., duplicate policy errors) are occurring?  
- **Q3A.2: Immediate Fixes:** Which quick remediation path (drop-if-exists or repair history) will unblock migration pushes?  
- **Q3A.3: Structural Improvements:** How should migrations be structured to prevent policy duplication in the future?  
- **Q3A.4: Remaining Mismatches:** What configuration or code issues remain that could cause related failures?  

## Required Deliverables for Mastery

- [ ] Written answers to the 4 Key Questions (included in the report)  
- [ ] Analysis summarized in `system-issues.md`  
- [ ] Updated migration scripts implementing the chosen remedy  
- [ ] Evidence of successful local and remote migration pushes  
- [ ] Completed Phase 3A Report documenting findings and fixes  

## Approach

1. Review `system-issues.md` to confirm root causes and remediation options.  
2. Choose and apply either the idempotent fix (Option A) or history repair (Option B).  
3. Test migrations locally (`npm run supabase:push:local`) and remotely (`npm run supabase:push`).  
4. Document each change, test result, and final verification in the Phase 3A Report.  

## Success Criteria

- All migrations apply without `ERROR 42710` or other policy conflicts.  
- Migration chain is clean and idempotent from a fresh database reset.  
- No duplicate policy errors in local or remote pushes.  

## Guardrails

- **Migration Timestamp Check:** Run `npm run migrations:check` in CI to detect duplicate timestamps.
- **CI Smoketest:** Include `supabase db reset && npm run supabase:push:local` in CI to catch syntax and idempotence errors.

## Next Steps

After Phase 3A remediation, proceed to [Phase 4: Backend (NestJS) Implementation Verification](../phase4/README.md).