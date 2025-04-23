#!/bin/bash

# load_secrets.sh - Load Supabase and application secrets for local development
# This script converts JSON secrets to environment variables for cross-platform compatibility

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set the secrets file path
SECRETS_FILE=~/.secrets/HomerConnect/secrets.json
ENV_FILE="$(dirname "$(dirname "$0")")/.env"
SUPABASE_ENV_FILE="$(dirname "$(dirname "$0")")/supabase/.env"

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Loading HomerConnect Secrets       ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if secrets file exists
if [ ! -f "$SECRETS_FILE" ]; then
  echo -e "${YELLOW}⚠️  Secrets file not found at $SECRETS_FILE${NC}"
  echo -e "${YELLOW}Creating empty secrets file...${NC}"
  
  # Create directory if it doesn't exist
  mkdir -p ~/.secrets/HomerConnect
  
  # Create empty JSON file with a template
  cat > "$SECRETS_FILE" << EOF
{
  "POSTGRES_PASSWORD": "your_password_here",
  "SUPABASE_URL": "your_supabase_url",
  "SUPABASE_ANON_KEY": "your_anon_key",
  "OPENAI_API_KEY": "your_openai_key_if_used"
}
EOF
  echo -e "${GREEN}✅ Created template secrets file. Please edit it with your actual secrets.${NC}"
  echo -e "${YELLOW}Edit the file: $SECRETS_FILE${NC}"
fi

# Check if jq is installed
if command -v jq >/dev/null 2>&1; then
  # Parse JSON using jq (more reliable)
  echo -e "${BLUE}🔑 Loading secrets using jq...${NC}"
  
  # Extract each key-value pair and export as environment variables
  while IFS="=" read -r key value; do
    # Remove quotes and export
    value="${value%\"}"
    value="${value#\"}"
    export "$key=$value"
    echo -e "${GREEN}✓${NC} Loaded $key"
  done < <(jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" "$SECRETS_FILE")
  
else
  # Fallback to bash parsing (less reliable but no dependencies)
  echo -e "${YELLOW}⚠️  jq not found, using fallback method for parsing JSON${NC}"
  echo -e "${YELLOW}For more reliable parsing, install jq: sudo apt install jq${NC}"
  
  # Read JSON file line by line
  while IFS= read -r line; do
    # Use regex to extract key-value pairs
    if [[ $line =~ \"([A-Z_]+)\"[[:space:]]*:[[:space:]]*\"([^\"]+)\" ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
      # Remove trailing comma if present
      value="${value%,}"
      export "$key=$value"
      echo -e "${GREEN}✓${NC} Loaded $key"
    fi
  done < "$SECRETS_FILE"
fi

# Create/update .env file for applications that use dotenv
echo -e "${BLUE}📝 Updating .env files...${NC}"
> "$ENV_FILE"  # Clear existing file
mkdir -p "$(dirname "$SUPABASE_ENV_FILE")"
> "$SUPABASE_ENV_FILE"  # Clear existing Supabase env file

# Write environment variables to .env files
if command -v jq >/dev/null 2>&1; then
  jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" "$SECRETS_FILE" > "$ENV_FILE"
  # Create Supabase .env file with the same content
  jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" "$SECRETS_FILE" > "$SUPABASE_ENV_FILE"
else
  # Fallback method if jq is not available
  while IFS= read -r line; do
    if [[ $line =~ \"([A-Z_]+)\"[[:space:]]*:[[:space:]]*\"([^\"]+)\" ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
      value="${value%,}"
      echo "$key=$value" >> "$ENV_FILE"
      echo "$key=$value" >> "$SUPABASE_ENV_FILE"
    fi
  done < "$SECRETS_FILE"
fi

# Handle special characters in passwords by escaping them in the env file
echo -e "${BLUE}🔒 Handling special characters in passwords...${NC}"

# Fix any special characters in the password that might cause issues when used in commands
if [[ -n "$POSTGRES_PASSWORD" ]]; then
  # Replace .env file with properly escaped password
  sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$(printf "%q" "$POSTGRES_PASSWORD")|" "$ENV_FILE"
  sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$(printf "%q" "$POSTGRES_PASSWORD")|" "$SUPABASE_ENV_FILE"
  
  echo -e "${GREEN}✓${NC} Special characters in passwords handled"
fi

echo -e "${GREEN}✅ Environment variables loaded successfully${NC}"
echo -e "${BLUE}========================================${NC}"

# If script is sourced, return success; otherwise exit
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
  return 0
else
  exit 0
fi