# Security Incident Response

This document outlines the steps to take when sensitive information is accidentally exposed in the codebase, particularly when secrets are committed to the Git repository.

## Responding to a Secret Exposure

### 1. Immediate Actions

When you discover that secrets have been exposed in the Git repository:

1. **Rotate All Exposed Credentials Immediately**
   - Consider all exposed credentials compromised
   - Generate new credentials for all affected services:
     - Supabase service role JWT
     - Database passwords
     - API keys
     - SMTP credentials
     - OAuth client secrets

2. **Update Environment Variables**
   - Update all affected environment variables in:
     - Local development environments
     - CI/CD pipeline configurations
     - Production deployment environments

### 2. Clean the Repository

Remove the secrets from the Git history using one of these methods:

#### Option A: Using BFG Repo-Cleaner (Recommended)

```bash
# Install BFG if needed
# brew install bfg (macOS) or download from https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh, mirror copy of the repository
git clone --mirror git@github.com:yourorg/HomerConnect.git HomerConnect-mirror

# CD into the mirrored repo
cd HomerConnect-mirror

# Remove files containing secrets from the entire history
bfg --delete-files .env
bfg --delete-files supabase/.env

# Optional: If you need to replace specific strings in other files
# Create a passwords.txt file with secrets to replace
# bfg --replace-text passwords.txt

# Clean up and garbage collect
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push the cleaned history
git push --force
```

#### Option B: Using git-filter-repo

```bash
# Install git-filter-repo if needed
# pip install git-filter-repo

# Make a fresh clone of the repository
git clone git@github.com:yourorg/HomerConnect.git HomerConnect-clean
cd HomerConnect-clean

# Remove sensitive files from history
git filter-repo --invert-paths --path .env --path supabase/.env

# Push the cleaned history
git push origin --force --all
git push origin --force --tags
```

### 3. Update Working Copies

After cleaning the repository history:

1. Notify all team members to update their working copies:

```bash
# For each developer
git fetch origin
git reset --hard origin/main # or your main branch name
```

2. Create new `.env` files based on the example files with the updated credentials.

### 4. Prevent Future Leaks

To prevent future incidents:

1. **Add Comprehensive Git Ignores**
   - Ensure all secret files are in `.gitignore`
   - Consider using `.gitignore` templates for your tech stack

2. **Implement Pre-commit Hooks**
   - Use `pre-commit` framework with plugins like:
     - `detect-secrets` (https://github.com/Yelp/detect-secrets)
     - `git-secrets` (https://github.com/awslabs/git-secrets)

3. **Use Environment Variable Management Tools**
   - Consider using tools like `direnv` or `dotenv-vault`
   - Store secrets in a separate location outside the repository

4. **Implement Secret Scanning in CI**
   - Enable GitHub's secret scanning feature
   - Consider adding scanning tools like GitGuardian to your CI pipeline

### 5. Document the Incident

Document the incident for future reference:

1. When the leak was discovered
2. What types of credentials were exposed
3. Actions taken to remediate
4. Improvements made to prevent future incidents

## Additional Resources

- [GitHub Documentation on Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
