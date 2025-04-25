# Project Overview

## Purpose & Scope

This document provides a single, exhaustive, and authoritative workflow designed to systematically audit, debug, and solidify an existing, partially built user management system. The system utilizes:

- **NestJS (Backend)**
- **Next.js (Frontend)**
- **Supabase (Database & Authentication)**
- **Mailtrap (for email testing)**

It replaces earlier, split documents by unifying every requirement, deliverable, and inspection gate into one comprehensive source of truth. The primary focus is on ensuring a **consistent, correct, and robust implementation** of user management features, including signup, signin, signout, profile view/edit, email authentication, and password reset.

A critical aspect of this workflow is the explicit checking for **consistency and the identification/resolution of duplication or incompatible implementations** across the entire project (backend code, frontend code, Supabase configuration).

## Workflow Philosophy: Mastery-Chunk Framework

This workflow is structured around sequential "Mastery Chunks" (Phases). Successful completion of each chunk requires demonstrating a deep understanding and verifiable resolution of the phase's objectives before proceeding to the next.

| Principle              | What it Means in Practice                                                                 | Evidence > Assertions                                                                 |
| :--------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **Show Your Work** | Provide concrete evidence of steps taken and changes made.                                | Raw outputs (build logs, console logs), screenshots, git commits, network logs.       |
| **Explain the Why** | Clearly articulate root causes, logic, and justification for choices and fixes.             | Detailed explanations within the Phase Report.                                        |
| **Write the Report** | Complete the dedicated "Documentation Section: Phase X Report" for each phase.           | The filled-out report section for each phase, synthesizing findings and evidence.   |
| **Pass-Gate Progression**| You may only start Phase N+1 once Phase N has cleanly passed its inspection checklist.     | Successful verification against the "Inspection Pass-Gate" criteria for the phase. |
| **Consistency is Paramount** | Prefer one clear, repeatable approach over multiple half-implemented or incompatible patterns. | Code refactoring eliminating duplication, standardized configuration/implementation. |

## Hybrid Strategy – "Fix → Evaluate"

This workflow employs a hybrid strategy:

1. **Phase 1 (Fix First):** You **must** stabilize the build and development server environments. Nothing else is reliably testable or evaluable until the application can compile and run without immediate crashes.

2. **Phases 2-6 (Evaluate Systematically):** For subsequent functional chunks (Configuration, Supabase, Backend, Frontend, Email Flows), you will **first perform a detailed "Inventory"** of the current state across relevant project layers before implementing fixes. This ensures you understand the full scope of inconsistencies, duplication, and issues for that specific area *before* making changes. Then, you debug, fix, test, and document.

3. **Phase 7 (Final Audit):** A final pass ensures documentation consistency and audits the codebase for any remaining, potentially subtle, inconsistencies or duplication.
