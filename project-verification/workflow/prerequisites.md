# Prerequisites & Environment Setup

Before starting, ensure your development environment is correctly set up. Document specific versions in the Phase 0 Report.

## Required Tools and Accounts

* **Node.js:** Stable version (LTS recommended).
* **Package Manager:** Choose one and use it consistently. Document which package manager is used: **[Specify Package Manager Here]**
* **Git:** Version control. Ensure your current codebase is **committed** before starting this workflow (`git status` should show a clean working tree).
* **Code Editor:** (VS Code, WebStorm, etc.)
* **Supabase Project:** Access to your existing project dashboard. Note your project URL and API keys.
* **Mailtrap Account:** Access to your existing account or set up a new one for testing. Note your SMTP credentials for your inbox.
* **Shell/Terminal:** (Bash, Zsh, PowerShell, etc.)
* **Postman or Insomnia (Optional but Recommended):** For testing backend API endpoints.

## Environment Files

* Locate existing `.env` files (e.g., `.env`, `.env.local`, `.env.development`).
* Verify `.gitignore` correctly excludes files containing secrets.
* Prepare to create or update a `.env.example` template.

## Prepare your Codebase

1. Make sure your current codebase is committed: `git status` should show a clean working tree
2. Document your Node.js version and package manager before starting
3. Create a new branch for this audit work: `git checkout -b audit-workflow`
4. Fill out the initial environment information in the Phase 0 Report
