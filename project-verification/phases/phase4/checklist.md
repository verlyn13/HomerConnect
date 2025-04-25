# Phase 4: Checklist & Step-by-Step Process

## Step 1: Define Standards

Answer these key questions to establish your backend standards:

- [ ] **Q4.1: Supabase Client Usage:** Define how the Supabase client should be initialized and used
  - [ ] Client creation (singleton service vs. multiple instances)
  - [ ] Key management (from configuration)
  - [ ] Service role usage restrictions
  - [ ] API vs. SDK methods

- [ ] **Q4.2: API Endpoints:** Define the required API endpoints
  - [ ] Routes and naming convention
  - [ ] HTTP methods
  - [ ] Request/response formats
  - [ ] Status codes

- [ ] **Q4.3: Input Validation:** Define the input validation approach
  - [ ] ValidationPipe usage
  - [ ] DTOs with class-validator
  - [ ] Custom validators

- [ ] **Q4.4: Auth & Authz:** Define the authentication and authorization approach
  - [ ] JWT verification
  - [ ] Guards
  - [ ] RLS vs. application-level checks

- [ ] **Q4.5: Error Handling:** Define the error handling approach
  - [ ] Error mapping from Supabase
  - [ ] Exception handling and HTTP status codes
  - [ ] Response format for errors

- [ ] **Q4.6: Logging:** Define the logging approach
  - [ ] Logger implementation
  - [ ] Log levels and contexts
  - [ ] Events to log

## Step 2: Inventory Backend Code

- [ ] **Controllers:**
  - [ ] Identify all controllers related to user management
  - [ ] List all endpoints, methods, and response types

- [ ] **Services:**
  - [ ] Identify all services related to user management
  - [ ] Note Supabase client usage
  - [ ] Check for duplicated logic

- [ ] **Modules:**
  - [ ] Check module structure and imports/exports
  - [ ] Note any custom providers

- [ ] **DTOs:**
  - [ ] Identify input/output DTOs for user management
  - [ ] Check validation rules

- [ ] **Guards/Interceptors:**
  - [ ] Identify authentication guards
  - [ ] Note how token verification is handled

- [ ] **Error Handling:**
  - [ ] Identify error handling patterns
  - [ ] Check for exception filters

- [ ] **Logging:**
  - [ ] Identify logging implementation
  - [ ] Note what events are logged

## Step 3: Compare to Standards

- [ ] Check if Supabase client usage matches your standard
- [ ] Check if API endpoints match your standard
- [ ] Check if input validation matches your standard
- [ ] Check if auth/authz matches your standard
- [ ] Check if error handling matches your standard
- [ ] Check if logging matches your standard

## Step 4: Identify Inconsistencies and Duplication

- [ ] Note any multiple Supabase client initializations
- [ ] Note any redundant endpoints with similar logic
- [ ] Note any scattered auth checks
- [ ] Note any inconsistent validation application
- [ ] Note any varied error response formats
- [ ] Note any multiple logging setups

## Step 5: Implement Fixes

- [ ] **Standardize Supabase Client:**
  - [ ] Create/refactor a SupabaseService for centralized client
  - [ ] Ensure it uses ConfigService for keys

- [ ] **Normalize API Endpoints:**
  - [ ] Refactor controllers to match API spec
  - [ ] Standardize response formats

- [ ] **Implement Consistent Validation:**
  - [ ] Create/update DTOs with proper validation
  - [ ] Apply ValidationPipe globally or to controllers

- [ ] **Standardize Auth/Authz:**
  - [ ] Implement/refactor AuthGuard
  - [ ] Apply consistently to protected routes

- [ ] **Improve Error Handling:**
  - [ ] Implement exception filters or mapping logic
  - [ ] Ensure consistent error response format

- [ ] **Setup Proper Logging:**
  - [ ] Implement/refactor logging service
  - [ ] Add logging to key operations

- [ ] **Remove Duplication:**
  - [ ] Consolidate common functionality
  - [ ] Remove redundant code

## Step 6: Test API Endpoints

Use Postman, Insomnia, or curl to test:

- [ ] **Authentication Endpoints:**
  - [ ] `POST /auth/signup` - Create a new user
  - [ ] `POST /auth/signin` - Log in a user
  - [ ] `POST /auth/signout` - Log out a user
  - [ ] `POST /auth/forgot-password` - Request password reset

- [ ] **Profile Endpoints:**
  - [ ] `GET /profile` - Get current user's profile
  - [ ] `PATCH /profile` - Update current user's profile

- [ ] **Test Validation:**
  - [ ] Valid input (happy path)
  - [ ] Invalid input (missing fields, wrong formats)

- [ ] **Test Authentication:**
  - [ ] Valid token
  - [ ] Invalid token
  - [ ] Expired token
  - [ ] No token

- [ ] **Test Error Scenarios:**
  - [ ] Duplicate email on signup
  - [ ] Invalid credentials on signin
  - [ ] Not found scenarios
  - [ ] Validation errors
  - [ ] Server errors

- [ ] **Verify Responses:**
  - [ ] Status codes match API spec
  - [ ] Response bodies match expected format
  - [ ] Error messages are informative

## Step 7: Document and Verify

- [ ] Document all findings in the Phase 4 Report
- [ ] Include API test evidence (screenshots, output logs)
- [ ] Verify code searches confirm duplication elimination
- [ ] Confirm all standards are now consistently applied

## Tests for this Phase

- [ ] All defined API endpoints return expected responses
- [ ] Input validation correctly rejects invalid requests
- [ ] Protected routes return 401/403 when authentication fails
- [ ] Error responses use consistent format and appropriate status codes
- [ ] Backend logs show key events as defined in the standard

## Inspection Pass-Gate

To pass this phase, you must have:

1. Clearly defined standards for all aspects of backend implementation
2. Documented all inconsistencies and duplications found during inventory
3. Refactored code to use consistent patterns and approaches
4. Removed duplicate functionality and consolidated code
5. Successfully tested all API endpoints with evidence
6. Verified that code now aligns with defined standards
7. Completed the Phase 4 Report with accurate information

Once all checklist items are complete and all tests pass, you can proceed to Phase 5.
