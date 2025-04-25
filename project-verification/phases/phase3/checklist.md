# Phase 3: Checklist & Step-by-Step Process

## Step 1: Define Standards

Answer these key questions to establish your Supabase configuration standards:

- [ ] **Q3.1: Auth Settings:** Define the required Supabase Authentication settings
  - [ ] Email/Password authentication
  - [ ] Email confirmation requirements
  - [ ] Security settings
  - [ ] External providers (if any)

- [ ] **Q3.2: Database Schema:** Define the required database schema for user profiles
  - [ ] Table names
  - [ ] Column names and data types
  - [ ] Primary/foreign key relationships
  - [ ] Constraints (`ON DELETE CASCADE`, etc.)
  - [ ] Indexes

- [ ] **Q3.3: Row Level Security (RLS):** Define the required RLS policies
  - [ ] RLS enabled/disabled
  - [ ] SELECT policies (who can view what)
  - [ ] INSERT policies (who can create what)
  - [ ] UPDATE policies (who can modify what)
  - [ ] DELETE policies (who can delete what)
  - [ ] `USING` and `WITH CHECK` conditions

- [ ] **Q3.4: Triggers/Functions:** Define any required database triggers or functions
  - [ ] User creation trigger
  - [ ] Profile update functions
  - [ ] Other required functions

- [ ] **Q3.5: SMTP Configuration:** Define the Mailtrap SMTP settings
  - [ ] Host
  - [ ] Port
  - [ ] Username
  - [ ] Sender email

## Step 2: Inventory Supabase Dashboard

- [ ] **Auth Settings:**
  - [ ] Navigate to Authentication -> Settings
  - [ ] Document current settings
  - [ ] Capture screenshots for evidence

- [ ] **Database Schema:**
  - [ ] Navigate to Table Editor
  - [ ] Document existing tables related to user profiles
  - [ ] Capture table structure (or SQL output of `\d tablename`)
  - [ ] Check for foreign key relationships and constraints

- [ ] **RLS Policies:**
  - [ ] Navigate to Authentication -> Policies
  - [ ] Document RLS status (enabled/disabled) for each table
  - [ ] Document existing policies and their conditions
  - [ ] Capture screenshots or SQL output

- [ ] **Triggers/Functions:**
  - [ ] Navigate to Database -> Functions
  - [ ] Document any user-related triggers or functions
  - [ ] Note their enabled/disabled status
  - [ ] Capture SQL definitions

- [ ] **SMTP Settings:**
  - [ ] Navigate to Project Settings -> Auth -> Email Templates
  - [ ] Document current SMTP configuration
  - [ ] Capture screenshot

## Step 3: Compare to Standards

- [ ] Compare Auth settings to defined standard
- [ ] Compare database schema to defined standard
- [ ] Compare RLS policies to defined standard
- [ ] Compare triggers/functions to defined standard
- [ ] Compare SMTP settings to defined standard

## Step 4: Identify Discrepancies

- [ ] Note any missing tables or columns
- [ ] Note any incorrect data types or constraints
- [ ] Note any missing or incorrect RLS policies
- [ ] Note any missing or disabled triggers/functions
- [ ] Note missing or incorrect SMTP settings

## Step 5: Apply Changes

- [ ] **Update Auth Settings:**
  - [ ] Adjust settings through the Supabase dashboard
  - [ ] Document each change made

- [ ] **Fix Database Schema:**
  - [ ] Create missing tables
  - [ ] Add missing columns
  - [ ] Modify data types
  - [ ] Add constraints
  - [ ] Use SQL Editor for complex changes (document SQL)

- [ ] **Correct RLS Policies:**
  - [ ] Enable RLS if needed
  - [ ] Create missing policies
  - [ ] Correct existing policy conditions
  - [ ] Document SQL for each policy change

- [ ] **Setup Triggers/Functions:**
  - [ ] Create missing functions
  - [ ] Enable disabled triggers
  - [ ] Fix function logic if needed
  - [ ] Document SQL for each function

- [ ] **Configure SMTP Settings:**
  - [ ] Enter Mailtrap credentials
  - [ ] Configure sender email
  - [ ] Save settings

## Step 6: Verify Changes

- [ ] **RLS Policy Testing:**
  - [ ] Use Policy Editor's test functionality
  - [ ] Or use SQL Editor with commands like:

    ```sql
    set role authenticated;
    set auth.uid() = '<some-user-id>';
    SELECT * FROM profiles;
    ```

  - [ ] Test each policy (SELECT, INSERT, UPDATE, DELETE)
  - [ ] Document test results

- [ ] **Trigger Testing:**
  - [ ] If user creation trigger exists, manually create a user in Supabase Auth
  - [ ] Verify a corresponding profile row is created
  - [ ] Document test results

- [ ] **Schema Verification:**
  - [ ] Verify constraints work as expected (e.g., cascading deletes)
  - [ ] Check indexes exist and are effective

- [ ] **SMTP Verification:**
  - [ ] This will be tested more thoroughly in Phase 6
  - [ ] For now, just verify settings are saved correctly

## Tests for this Phase

- [ ] Supabase dashboard reflects the correct Auth settings
- [ ] The required database table(s) for profiles exist with the correct schema
- [ ] RLS is enabled on profile tables
- [ ] Required RLS policies are present and verified to work
- [ ] Required triggers/functions are present and enabled
- [ ] Supabase SMTP settings are correctly pointing to Mailtrap

## Inspection Pass-Gate

To pass this phase, you must have:

1. Clearly defined standards for all aspects of Supabase configuration
2. Documented the initial state found during inventory
3. Applied necessary changes to align with the defined standards
4. Tested and verified that the changes work as expected
5. Documented all findings, changes, and test results in the Phase 3 Report
6. Provided evidence (screenshots, SQL output) of before and after states

Once all checklist items are complete and all tests pass, you can proceed to Phase 4.
