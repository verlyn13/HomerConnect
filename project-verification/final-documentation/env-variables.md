# Final Environment Variables Documentation

This document contains the final, verified `.env.example` file that lists all environment variables required by the project. This represents the outcome of standardization in Phase 2 and subsequent phases.

## `.env.example` File Content

```dotenv
# Example .env file - DO NOT commit secrets!
# This template lists ALL environment variables required by the project.

# Supabase
SUPABASE_URL="[Your Supabase Project URL]"
SUPABASE_ANON_KEY="[Your Supabase Anon Key - okay in client-side code but treat as secret in .env]"
SUPABASE_SERVICE_ROLE_KEY="[Your Supabase Service Role Key - SERVER SIDE ONLY, HIGHLY SENSITIVE]"

# Mailtrap (for testing emails)
MAILTRAP_SMTP_HOST="[Mailtrap SMTP Host]"
MAILTRAP_SMTP_PORT="[Mailtrap SMTP Port]"
MAILTRAP_SMTP_USERNAME="[Mailtrap SMTP Username]"
MAILTRAP_SMTP_PASSWORD="[Mailtrap SMTP Password]"
MAIL_SENDER_EMAIL="[e.g., noreply@your-app.com - Should match sender configured in Supabase SMTP]"

# Backend
BACKEND_PORT=3000 # Or whatever your NestJS app runs on

# Frontend
NEXT_PUBLIC_BACKEND_API_URL="[Your Backend API URL, e.g., http://localhost:3000/api]"
NEXT_PUBLIC_SUPABASE_URL="[Your Supabase Project URL]" # Only needed if accessing Supabase directly from FE
NEXT_PUBLIC_SUPABASE_ANON_KEY="[Your Supabase Anon Key]" # Only needed if accessing Supabase directly from FE

# Add any other variables identified during the audit...
# MY_OTHER_VARIABLE="[Description/Example Value]"
```

## Environment Variable Standards

These standards were defined in Phase 2 and implemented throughout the project:

### Env File Location
[Standard defined in Phase 2 report]

### Naming Convention
[Standard defined in Phase 2 report]

### Backend Access Method
[Standard defined in Phase 2 report]

### Frontend Access Method
[Standard defined in Phase 2 report]

### Secrets Handling
[Standard defined in Phase 2 report]

## Variable Groupings

### Supabase Variables
- **Purpose**: Authentication, database access, and service role operations
- **Usage**: [Where and how these are used]

### Mailtrap Variables
- **Purpose**: Email testing for authentication flows
- **Usage**: [Where and how these are used]

### Backend Variables
- **Purpose**: Server configuration
- **Usage**: [Where and how these are used]

### Frontend Variables
- **Purpose**: Client-side API access and configuration
- **Usage**: [Where and how these are used]

## Security Considerations

- Sensitive variables are excluded from Git through `.gitignore`
- Service Role Key is only used server-side
- Public variables use the appropriate prefixes

## Usage Instructions

1. Copy the `.env.example` file to create your `.env` file: `cp .env.example .env`
2. Fill in all required values with your specific configuration
3. Ensure your `.env` file is listed in `.gitignore` to prevent committing secrets
4. If you add new environment variables to the project, update the `.env.example` file accordingly
