# Mastery-Chunk Checklist

This section lists the phases and their core objectives. Each phase is detailed in its own folder.

| Phase | Objective                                                    | Key Focus Areas                                         |
| :---- | :----------------------------------------------------------- | :------------------------------------------------------ |
| **0** | Initial Assessment & Build Error Identification              | Scan codebase, attempt builds, capture errors           |
| **1** | Stabilize the Build Environment                              | Fix build and startup errors                            |
| **2** | Configuration & Environment Variable Consistency             | Standardize env vars and config access                  |
| **3** | Supabase Configuration Verification                          | Verify auth settings, DB schema, RLS, triggers, SMTP    |
| **4** | Backend (NestJS) Implementation Verification                 | Verify API endpoints, validation, auth, error handling  |
| **5** | Frontend (Next.js) Implementation Verification               | Verify pages, state management, API calls, forms, UI    |
| **6** | Email Flow Verification (End-to-End)                         | Test signup confirmation and password reset flows       |
| **7** | Documentation & Project Consistency Audit                    | Final audit of docs and code for consistency            |

## Progression Requirements

Each phase has specific "pass-gate" criteria that must be met before proceeding to the next phase:

1. **Evidence-Based Reporting**: Each phase report must include concrete evidence (logs, screenshots, commit links)
2. **Complete Documentation**: The phase report must fully document the before/after state and all changes made
3. **Pass All Tests**: All tests defined in the phase checklist must pass
4. **Inspection Pass-Gate**: The specific criteria defined for the phase must be met
5. **Consistency Check**: Ensure changes maintain (or improve) consistency across the codebase

## Phase Dependencies

* **Phase 0-1**: Must be completed in order, as the codebase needs to build before further verification
* **Phase 2**: Configuration standardization provides foundation for subsequent phases
* **Phases 3-6**: While sequential completion is recommended, limited parallel work is possible if dependencies are managed
* **Phase 7**: Can only be completed after all other phases are finished

Refer to each phase's detailed documentation for specific requirements, steps, and deliverables.
