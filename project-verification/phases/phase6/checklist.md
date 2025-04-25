# Phase 6: Checklist & Step-by-Step Process

## Step 1: Define Standards

Answer these key questions to establish your email flow standards:

- [ ] **Q6.1: Signup Flow:** Define the required step-by-step flow for signup with email confirmation
  - [ ] User action sequence
  - [ ] Application steps
  - [ ] Email sending
  - [ ] Link handling
  - [ ] User status updates

- [ ] **Q6.2: Password Reset Flow:** Define the required step-by-step flow for password reset
  - [ ] User action sequence
  - [ ] Application steps
  - [ ] Email sending
  - [ ] Token handling
  - [ ] Password update

- [ ] **Q6.3: Mailtrap Verification:** Define how Mailtrap emails are verified during testing
  - [ ] Authentication method
  - [ ] Email verification process
  - [ ] Token extraction
  - [ ] Accessibility testing

## Step 2: Inventory Email Flows Configuration and Code

- [ ] **Supabase Auth Settings:**
  - [ ] Review confirmation email settings
  - [ ] Check redirect URLs
  - [ ] Verify email templates
  - [ ] Check SMTP configuration (confirmed in Phase 3)

- [ ] **Backend Email-Related Code:**
  - [ ] Identify endpoints triggering emails
  - [ ] Check password reset token generation/validation
  - [ ] Review redirects/callbacks handling
  - [ ] Check error handling

- [ ] **Frontend Email-Related Code:**
  - [ ] Identify confirmation success page
  - [ ] Check password reset request page
  - [ ] Verify password reset page
  - [ ] Review token extraction logic
  - [ ] Check error handling

## Step 3: Trace End-to-End Flows

- [ ] **Signup Confirmation Flow:**
  - [ ] Frontend signup form submission
  - [ ] Backend API call
  - [ ] Supabase user creation
  - [ ] Email sending
  - [ ] Email receipt
  - [ ] Link clicking
  - [ ] Redirection
  - [ ] User status update

- [ ] **Password Reset Flow:**
  - [ ] Frontend password reset request
  - [ ] Backend API call
  - [ ] Supabase password reset
  - [ ] Email sending
  - [ ] Email receipt
  - [ ] Link clicking
  - [ ] Token extraction
  - [ ] Password update form
  - [ ] New password submission
  - [ ] Password update

## Step 4: Identify Broken Steps, Inconsistencies, or Duplications

- [ ] Note any broken links in the flow chain
- [ ] Identify incorrect redirect URLs
- [ ] Check for mismatched token handling
- [ ] Look for duplicate email sending logic
- [ ] Verify email templates match application design
- [ ] Check error handling completeness

## Step 5: Implement Fixes

- [ ] **Correct Supabase Settings:**
  - [ ] Update redirect URLs if needed
  - [ ] Fix email templates if needed
  - [ ] Adjust other settings as required

- [ ] **Align Frontend/Backend Logic:**
  - [ ] Ensure correct Supabase client methods are called
  - [ ] Fix any incomplete implementation

- [ ] **Fix Token Handling:**
  - [ ] Correct token extraction logic
  - [ ] Ensure token is correctly used in password reset

- [ ] **Eliminate Duplication:**
  - [ ] Consolidate email triggering logic
  - [ ] Standardize token handling

## Step 6: Test End-to-End Flows with Mailtrap

- [ ] **Test Signup Confirmation:**
  - [ ] Sign up a new user via the frontend
  - [ ] Check Mailtrap for confirmation email
  - [ ] Verify email content and formatting
  - [ ] Click confirmation link
  - [ ] Verify user status update
  - [ ] Test login with confirmed account

- [ ] **Test Password Reset:**
  - [ ] Request password reset for an existing user
  - [ ] Check Mailtrap for reset email
  - [ ] Verify email content and formatting
  - [ ] Click reset link
  - [ ] Verify redirection to reset page
  - [ ] Verify token in URL
  - [ ] Enter new password
  - [ ] Submit form
  - [ ] Test login with new password
  - [ ] Test login with old password (should fail)

- [ ] **Check for Unexpected Emails:**
  - [ ] Verify no duplicate emails are sent
  - [ ] Check no emails are sent during other operations

## Step 7: Document and Verify

- [ ] Document all findings in the Phase 6 Report
- [ ] Include email testing evidence (screenshots, success/failure reports)
- [ ] Verify flow works end-to-end consistently
- [ ] Confirm all standards are now consistently applied

## Tests for this Phase

- [ ] Signup confirmation email is correctly sent to Mailtrap
- [ ] Confirmation link works and updates user status
- [ ] Password reset email is correctly sent to Mailtrap
- [ ] Reset link contains the correct token and redirects properly
- [ ] New password can be set and used to login
- [ ] Old password no longer works after reset
- [ ] No unexpected emails are sent during other operations

## Inspection Pass-Gate

To pass this phase, you must have:

1. Clearly defined standards for email flow implementation
2. Documented all broken steps, inconsistencies, and duplications found during inventory
3. Fixed all issues to create a complete, working end-to-end flow
4. Successfully tested both flows with evidence
5. Verified that there are no remaining inconsistencies in the email flows
6. Completed the Phase 6 Report with accurate information and evidence

Once all checklist items are complete and all tests pass, you can proceed to Phase 7.
