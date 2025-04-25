# Phase 2: Checklist & Step-by-Step Process

## Step 1: Define Standards

Answer these key questions to establish your configuration standards:

- [ ] **Q2.1: Env File Location:** Where should environment variables be defined? (e.g., `.env` at project root, separate files in backend/frontend, etc.)
- [ ] **Q2.2: Naming Convention:** What naming convention should be used? (e.g., `UPPER_CASE`, prefixes like `NEXT_PUBLIC_`, etc.)
- [ ] **Q2.3: Backend Access:** How should variables be accessed in NestJS? (e.g., direct `process.env`, `@nestjs/config`, etc.)
- [ ] **Q2.4: Frontend Access:** How should variables be accessed in Next.js? (e.g., direct `process.env`, custom hook, etc.)
- [ ] **Q2.5: Secrets Identification:** List all variables that are secrets and must never be committed to Git
- [ ] **Q2.6: `.env.example` Structure:** Define where `.env.example` will be located and what it includes

## Step 2: Inventory Configuration

- [ ] **Find all `.env*` files:**
  - [ ] Root directory
  - [ ] Backend directory
  - [ ] Frontend directory
  - [ ] Other locations

- [ ] **Find all config files:**
  - [ ] Backend config files (e.g., `config.ts`, `config.module.ts`)
  - [ ] Frontend config files (e.g., `config.js`, `next.config.js`)

- [ ] **Search for env var usage:**
  - [ ] Search for `process.env.` in backend code
  - [ ] Search for `process.env.` in frontend code
  - [ ] Search for `ConfigService` or similar config access methods
  - [ ] Look for hardcoded values related to:
    - [ ] Supabase URLs and keys
    - [ ] API endpoints
    - [ ] Mailtrap settings
    - [ ] Database credentials
    - [ ] Other configuration values

## Step 3: Compare to Standards

- [ ] Check if env file locations match your defined standard
- [ ] Check if naming conventions match your standard
- [ ] Check if access methods match your standard
- [ ] Check if secrets handling matches your standard
- [ ] Compile a comprehensive list of all environment variables currently in use

## Step 4: Identify Inconsistencies and Duplication

- [ ] Note any variables defined in multiple locations
- [ ] Note any variables accessed using different methods
- [ ] Note any configuration values that are hardcoded
- [ ] Note any inconsistently named variables
- [ ] Note any duplicated configuration loading logic

## Step 5: Implement Fixes

- [ ] **Refactor Access Methods:**
  - [ ] Update backend code to use standard access method (e.g., `@nestjs/config`)
  - [ ] Update frontend code to use standard access method

- [ ] **Consolidate Definitions:**
  - [ ] Merge configuration into standard locations
  - [ ] Remove redundant variable definitions

- [ ] **Standardize Names:**
  - [ ] Rename variables to match convention
  - [ ] Update code to use new names

- [ ] **Fix `.gitignore`:**
  - [ ] Ensure all files with secrets are listed
  - [ ] Check that `.env` files are properly ignored

- [ ] **Create/Update `.env.example`:**
  - [ ] List all required variables
  - [ ] Provide example values or placeholders
  - [ ] Include comments explaining variable purposes
  - [ ] Do NOT include actual secret values

## Step 6: Test Configuration

- [ ] Clean and reinstall dependencies to ensure clean state
- [ ] Start backend development server using new configuration
- [ ] Start frontend development server using new configuration
- [ ] Verify application functionality still works with refactored configuration

## Step 7: Verify Security

- [ ] Run `git status` to confirm `.env` files are not staged
- [ ] Check Git history to ensure no secrets were previously committed
- [ ] Verify `.env.example` does not contain sensitive values

## Tests for this Phase

- [ ] The application starts successfully with the consolidated environment variables
- [ ] Sensitive variables are confirmed to be listed in `.gitignore` and not present in Git
- [ ] `.env.example` accurately lists all required variables without sensitive values
- [ ] Code search confirms standard access methods are used throughout the codebase

## Inspection Pass-Gate

To pass this phase, you must have:

1. Clearly defined standards for all aspects of configuration handling
2. Documented all inconsistencies and duplications found during inventory
3. Refactored code to use consistent environment variable access
4. Consolidated environment variable definitions to standard locations
5. Removed hardcoded values and replaced with environment variables
6. Created an accurate `.env.example` file
7. Verified secrets are properly secured
8. Completed the Phase 2 Report with accurate information
9. Confirmed the application still works with the refactored configuration

Once all checklist items are complete and all tests pass, you can proceed to Phase 3.
