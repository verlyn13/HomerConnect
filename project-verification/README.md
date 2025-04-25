# Project Verification & Solidification Workflow

## User Management System – Unified Audit & Mastery Framework

**(Supabase | NestJS | Next.js | Mailtrap)**

This repository contains a comprehensive workflow for systematically auditing, debugging, and solidifying the existing user management system.

## How to Use This Folder Structure

1. Start by reading the [workflow overview](workflow/overview.md) to understand the project's purpose, philosophy, and strategy.
2. Check the [prerequisites](workflow/prerequisites.md) to ensure your environment is properly set up.
3. Review the [mastery-chunks](workflow/mastery-chunks.md) for a summary of all phases.
4. For each phase:
   - Begin by reading the phase's `README.md` to understand objectives and deliverables
   - Follow the detailed steps in `checklist.md`
   - Document your findings using the `report-template.md`
   - Copy your completed report to the `/reports` folder
   - Only proceed to the next phase after passing the current phase's inspection gate

5. During Phase 7, complete the final documentation in the `/final-documentation` folder.

## Mastery-Chunk Framework

This workflow is structured around sequential "Mastery Chunks" (Phases). You must complete each phase successfully before proceeding to the next:

| Phase | Objective                                                    |
| :---- | :----------------------------------------------------------- |
| **0** | Initial Assessment & Build Error Identification              |
| **1** | Stabilize the Build Environment                              |
| **2** | Configuration & Environment Variable Consistency             |
| **3** | Supabase Configuration Verification                          |
| **4** | Backend (NestJS) Implementation Verification               |
| **5** | Frontend (Next.js) Implementation Verification               |
| **6** | Email Flow Verification (End-to-End)                       |
| **7** | Documentation & Project Consistency Audit                  |

## Important Principles

| Principle              | What it Means in Practice                                                                 |
| :--------------------- | :---------------------------------------------------------------------------------------- |
| **Show Your Work** | Provide concrete evidence of steps taken and changes made.                                |
| **Explain the Why** | Clearly articulate root causes, logic, and justification for choices and fixes.             |
| **Write the Report** | Complete the dedicated report for each phase, synthesizing findings and evidence.   |
| **Pass-Gate Progression**| You may only start Phase N+1 once Phase N has cleanly passed its inspection checklist.     |
| **Consistency is Paramount** | Prefer one clear, repeatable approach over multiple half-implemented or incompatible patterns. |
