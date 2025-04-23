# HomerConnect Replit Workflow Guide

## Introduction
This guide provides structured workflows for Replit to execute when building and developing the HomerConnect project. Each workflow is precisely aligned with implementation stages and tasks to ensure proper sequencing and prerequisite handling.

## Environment Configuration

### Required Secrets
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_REF=your-project-reference-id
SUPABASE_ACCESS_TOKEN=your-access-token
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres
```

### .replit Configuration
```
ENABLE_NODE_WORKSPACES=1
NODE_VERSION=20.x
```

### replit.nix
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.npm
    pkgs.nodePackages.typescript
    pkgs.supabase-cli
  ];
}
```

## Implementation Stage-Based Workflows

### 1: Initialization Workflows

#### INIT-01: Setup Dependencies
```yaml
name: "INIT-01: Setup Dependencies"
description: "Install all package dependencies across the monorepo"
execution: "sequential"
tasks:
  - name: "Install Root Dependencies"
    shell: "npm install"
  - name: "Install Frontend Dependencies"
    shell: "cd apps/frontend && npm install"
  - name: "Install Backend Dependencies" 
    shell: "cd apps/backend && npm install"
  - name: "Verify Dependency Installation"
    shell: "echo '✅ Dependencies installed successfully!'"
```

#### INIT-02: Setup Linting & Formatting
```yaml
name: "INIT-02: Setup Linting & Formatting"
description: "Install missing ESLint and Prettier dependencies"
execution: "sequential"
tasks:
  - name: "Install Missing ESLint Dependencies"
    shell: "cd apps/backend && npm install --save-dev eslint-plugin-prettier"
  - name: "Install Missing Frontend Dependencies"
    shell: "cd apps/frontend && npm install --save-dev eslint-plugin-prettier"
  - name: "Verify ESLint Configuration"
    shell: "cd apps/backend && npx eslint --print-config src/main.ts > /dev/null && echo '✅ ESLint configuration verified!'"
```

#### INIT-03: Fix Next.js Configuration
```yaml
name: "INIT-03: Fix Next.js Configuration"
description: "Convert next.config.ts to next.config.js/mjs if needed"
execution: "sequential"
tasks:
  - name: "Check for next.config.ts"
    shell: "if [ -f apps/frontend/next.config.ts ]; then echo 'Converting next.config.ts to next.config.js'; cat apps/frontend/next.config.ts | sed 's/export default/module.exports =/' > apps/frontend/next.config.js && rm apps/frontend/next.config.ts; else echo 'No conversion needed'; fi"
```

#### INIT-04: Link Supabase Project
```yaml
name: "INIT-04: Link Supabase Project"
description: "Link to existing Supabase project"
execution: "sequential"
tasks:
  - name: "Login to Supabase with Token"
    shell: "npx supabase login $SUPABASE_ACCESS_TOKEN"
  - name: "Link to Supabase Project"
    shell: "cd supabase && npx supabase link --project-ref $SUPABASE_PROJECT_REF"
  - name: "Verify Successful Link"
    shell: "cd supabase && npx supabase projects list | grep $SUPABASE_PROJECT_REF && echo '✅ Supabase project linked successfully!'"
```

### 2: Foundation Workflows

#### FND-01: Apply Database Migrations
```yaml
name: "FND-01: Apply Database Migrations"
description: "Apply pending migrations to Supabase"
execution: "sequential"
tasks:
  - name: "Verify Supabase Link Status"
    shell: "cd supabase && npx supabase projects list | grep $SUPABASE_PROJECT_REF || (echo '❌ Project not linked' && exit 1)"
  - name: "Apply Migrations to Remote Database"
    shell: "cd supabase && npx supabase db push"
  - name: "Verify Migration Success"
    shell: "echo '✅ Database migrations applied successfully!'"
```

#### FND-02: Configure TypeScript Settings
```yaml
name: "FND-02: Configure TypeScript"
description: "Set up and verify TypeScript configurations"
execution: "sequential"
tasks:
  - name: "Check Frontend TS Config"
    shell: "cd apps/frontend && npx tsc --noEmit && echo '✅ Frontend TypeScript configuration verified!'"
  - name: "Check Backend TS Config"
    shell: "cd apps/backend && npx tsc --noEmit && echo '✅ Backend TypeScript configuration verified!'"
```

#### FND-03: Setup Supabase Auth
```yaml
name: "FND-03: Setup Supabase Auth"
description: "Enable and configure Supabase authentication"
execution: "sequential"
tasks:
  - name: "Enable Email/Password Auth in Supabase"
    shell: "echo 'To enable Email/Password auth provider, go to Supabase Dashboard -> Authentication -> Providers -> Email and toggle it ON'"
  - name: "Configure Auth Settings with Supabase CLI" 
    shell: "cd supabase && npx supabase config set auth.email.enable_signup true --project-ref $SUPABASE_PROJECT_REF"
  - name: "Verify Auth Configuration"
    shell: "echo '✅ Supabase Auth configured successfully! Verify the settings in your Supabase dashboard.'"
```

#### FND-04: Create Database Trigger
```yaml
name: "FND-04: Create Profile Trigger"
description: "Implement profile creation trigger"
execution: "sequential"
tasks:
  - name: "Create Migration File for Trigger"
    shell: "cd supabase && npx supabase migration new profile_creation_trigger"
  - name: "Verify Migration File Created"
    shell: "echo '✅ Migration file created! Now edit the file to add the profile creation trigger SQL.'"
  - name: "Instructions for Trigger"
    shell: "echo 'Add the following SQL to the migration file:\n\nCREATE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO public.profiles (id, created_at, updated_at, username, full_name, avatar_url)\n  VALUES (NEW.id, NEW.created_at, NEW.created_at, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER;\n\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();'"
```

#### FND-05: Implement RLS Policies
```yaml
name: "FND-05: Create RLS Policies"
description: "Create Row Level Security policies for database tables"
execution: "sequential"
tasks:
  - name: "Create Migration File for RLS"
    shell: "cd supabase && npx supabase migration new rls_policies"
  - name: "Instructions for Profiles RLS"
    shell: "echo 'Add the following SQL to implement RLS for profiles table:\n\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY \"Users can view all profiles\" ON public.profiles FOR SELECT USING (true);\n\nCREATE POLICY \"Users can update their own profile\" ON public.profiles FOR UPDATE USING (auth.uid() = id);'"
  - name: "Instructions for Events RLS"
    shell: "echo 'Add the following SQL to implement RLS for events table:\n\nALTER TABLE public.events ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY \"Events are viewable by everyone\" ON public.events FOR SELECT USING (true);\n\nCREATE POLICY \"Users can insert their own events\" ON public.events FOR INSERT WITH CHECK (auth.uid() = creator_id);\n\nCREATE POLICY \"Users can update their own events\" ON public.events FOR UPDATE USING (auth.uid() = creator_id);'"
```

### 3: Development Workflows

#### DEV-01: Run Frontend
```yaml
name: "DEV-01: Run Frontend"
description: "Start the Next.js development server"
execution: "sequential"
tasks:
  - name: "Load Environment Variables"
    shell: "bash scripts/load_secrets.sh"
  - name: "Verify Environment Variables"
    shell: "cd apps/frontend && printenv | grep -q SUPABASE_URL || (echo '❌ Required environment variables missing!' && exit 1)"
  - name: "Start Next.js Dev Server"
    shell: "cd apps/frontend && npm run dev"
```

#### DEV-02: Run Backend
```yaml
name: "DEV-02: Run Backend"
description: "Start the NestJS development server"
execution: "sequential"
tasks:
  - name: "Load Environment Variables"
    shell: "bash scripts/load_secrets.sh"
  - name: "Verify Environment Variables"
    shell: "cd apps/backend && printenv | grep -q SUPABASE_URL || (echo '❌ Required environment variables missing!' && exit 1)"
  - name: "Start NestJS Dev Server"
    shell: "cd apps/backend && npm run start:dev"
```

#### DEV-03: Run Full Stack
```yaml
name: "DEV-03: Run Full Stack"
description: "Run both frontend and backend servers with proper environment setup"
execution: "sequential"
tasks:
  - name: "Load Environment Variables"
    shell: "bash scripts/load_secrets.sh"
  - name: "Verify Environment Variables"
    shell: "printenv | grep -q SUPABASE_URL || (echo '❌ Required environment variables missing!' && exit 1)"
  - name: "Start Dev Servers (use separate terminals)"
    shell: "echo '⚠️ In Replit, start each server in a separate Shell tab:\n1. Run \"cd apps/frontend && npm run dev\" in one tab\n2. Run \"cd apps/backend && npm run start:dev\" in another tab'"
```

### 4: Quality Assurance Workflows

#### QA-01: Lint All
```yaml
name: "QA-01: Lint All"
description: "Run ESLint for both frontend and backend"
execution: "sequential"
tasks:
  - name: "Lint Frontend"
    shell: "cd apps/frontend && npm run lint || echo '⚠️ Frontend linting issues found'"
  - name: "Lint Backend"
    shell: "cd apps/backend && npm run lint || echo '⚠️ Backend linting issues found'"
```

#### QA-02: Format All
```yaml
name: "QA-02: Format All"
description: "Run Prettier to format code for both frontend and backend"
execution: "sequential"
tasks:
  - name: "Format Frontend Code"
    shell: "cd apps/frontend && npm run format:write || echo '⚠️ Frontend formatting issues found'"
  - name: "Format Backend Code"
    shell: "cd apps/backend && npm run format:write || echo '⚠️ Backend formatting issues found'"
```

#### QA-03: Type Check All
```yaml
name: "QA-03: Type Check All"
description: "Run TypeScript compiler to check types"
execution: "sequential"
tasks:
  - name: "Type Check Frontend"
    shell: "cd apps/frontend && npx tsc --noEmit || echo '⚠️ Frontend type issues found'"
  - name: "Type Check Backend"
    shell: "cd apps/backend && npx tsc --noEmit || echo '⚠️ Backend type issues found'"
```

## Task-Specific Implementation Steps

### Next Steps (Based on Implementation Plan)

#### FND-03.7: Finalize Database Schema
1. Review current schema in `supabase/migrations/20250423171929_initial_schema.sql`
2. Make any necessary adjustments
3. Run FND-01 workflow to apply changes

#### FND-04.6: Implement Profile Creation Trigger
1. Run FND-04 workflow to create migration file
2. Edit the generated migration file with the provided SQL trigger
3. Run FND-01 workflow to apply the trigger

#### FND-05: Setup Basic Supabase Auth Integration
1. Run FND-03 workflow to configure Supabase auth settings
2. Run FND-05 workflow to create migration file for RLS policies
3. Edit the generated migration file with the provided RLS policies
4. Run FND-01 workflow to apply the policies

## Implementation Order Guide

### Current Focus: Foundation Stage (15% Complete)

1. **First: Complete Database Schema Implementation**
   - Run FND-04: Create Profile Trigger workflow
   - Edit trigger migration file
   - Run FND-01: Apply Database Migrations workflow
   - Run FND-05: Implement RLS Policies workflow
   - Edit RLS migration file
   - Run FND-01: Apply Database Migrations workflow again

2. **Next: Setup Auth Integration**
   - Run FND-03: Setup Supabase Auth workflow
   - Manually implement frontend auth (FND-06 tasks)
   - Verify auth flow works correctly

3. **Then: Complete TypeScript Configuration**
   - Run FND-02: Configure TypeScript Settings workflow
   - Fix any type errors identified

## Common Issues & Solutions

### Supabase Connection Issues
- **Error**: "connection refused" when running migrations
- **Solution**: 
  1. Check that `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` are correct
  2. Run `npx supabase login $SUPABASE_ACCESS_TOKEN` before other commands
  3. Use `db push` instead of `migration up` for remote Supabase projects
  4. Verify network connectivity to Supabase service

### Next.js Configuration Issues
- **Error**: "Configuring Next.js via 'next.config.ts' is not supported"
- **Solution**: Run the INIT-03 workflow to convert to .js/.mjs format

### ESLint/Prettier Issues
- **Error**: "Cannot find package 'eslint-plugin-prettier'"
- **Solution**: Run the INIT-02 workflow to install missing dependencies

### Environment Variable Issues
- **Error**: Missing environment variables when running apps
- **Solution**: Run `bash scripts/load_secrets.sh` before starting servers

## Workflow Best Practices

1. **Validate Prerequisites**: Always check dependencies and environment before executing main tasks
2. **Follow Task Order**: Adhere to implementation plan dependencies and sequencing
3. **Use Appropriate Workflows**: Select workflows based on current implementation stage
4. **Sequential Migrations**: Apply database changes in order (schema → triggers → RLS policies)
5. **Verify Results**: Check for success messages after each workflow step

## Default Run Configuration

For Replit's run button, configure based on current stage:
- **During initialization**: "INIT-01: Setup Dependencies" 
- **During active development**: "DEV-03: Run Full Stack"