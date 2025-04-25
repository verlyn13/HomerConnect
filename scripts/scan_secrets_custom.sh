#!/bin/bash
# Custom script to scan for secrets while ignoring known false positives

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Custom Secret Scan                 ${NC}"
echo -e "${BLUE}========================================${NC}"

# Make sure detect-secrets is installed
if ! command -v detect-secrets &> /dev/null; then
    echo -e "${YELLOW}detect-secrets not found. Installing...${NC}"
    pip install detect-secrets
fi

# Create a temporary configuration
TMP_CONFIG=$(mktemp)
cat > "$TMP_CONFIG" << EOF
{
  "filters": {
    "patterns": [
      {
        "pattern": "\"integrity\":\\s*\"[^\"]+\"",
        "name": "npm integrity hash"
      },
      {
        "pattern": "\\b[Ii]ntegrity=['\\"][a-zA-Z0-9+/=:\\-]+['\\"]",
        "name": "generic integrity hash"
      }
    ]
  }
}
EOF

# Scan with custom options
echo -e "${BLUE}Scanning for secrets (ignoring integrity hashes)...${NC}"
detect-secrets scan \
  --exclude-files "package-lock.json|yarn.lock|.*\\.min\\.js|.*\\.min\\.css|.*\\.svg" \
  --custom-plugins "scripts/detect_secrets_filters.py" \
  --config "$TMP_CONFIG" \
  "$@"

# Clean up
rm "$TMP_CONFIG"

echo -e "${GREEN}Scan complete.${NC}"
echo -e "${BLUE}========================================${NC}"