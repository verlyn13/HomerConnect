#!/bin/bash
# Script to commit changes while bypassing pre-commit hooks

# Stop on errors
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Commit Without Hooks               ${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $# -eq 0 ]; then
  echo -e "${RED}Error: No commit message provided.${NC}"
  echo "Usage: $0 \"Your commit message\""
  exit 1
fi

COMMIT_MSG="$1"

echo -e "${YELLOW}WARNING: This will bypass all pre-commit hooks.${NC}"
echo -e "${YELLOW}Only use this for emergency commits or when hooks are causing false positives.${NC}"
echo "Commit message: \"$COMMIT_MSG\""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${BLUE}Committing changes with --no-verify...${NC}"
  git commit -m "$COMMIT_MSG" --no-verify
  echo -e "${GREEN}Commit successful!${NC}"
  echo -e "${YELLOW}Note: Pre-commit hooks were bypassed for this commit.${NC}"
  echo -e "${YELLOW}Consider fixing any hook issues for future commits.${NC}"
else
  echo "Commit aborted."
fi
