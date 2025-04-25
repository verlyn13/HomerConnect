#!/bin/bash
# Script to temporarily enable/disable pre-commit hooks

# Stop on errors
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if hooks are currently enabled by looking for the .git/hooks/pre-commit file
if [ -f .git/hooks/pre-commit ]; then
    echo -e "${BLUE}Pre-commit hooks are currently enabled.${NC}"
    
    # Ask if user wants to disable
    read -p "Do you want to disable pre-commit hooks temporarily? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Rename the pre-commit hook to disable it
        mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
        echo -e "${GREEN}Pre-commit hooks have been disabled.${NC}"
        echo -e "${YELLOW}NOTE: Run this script again to re-enable the hooks.${NC}"
    else
        echo "No changes made. Hooks remain enabled."
    fi
else
    # Check if there's a disabled pre-commit hook
    if [ -f .git/hooks/pre-commit.disabled ]; then
        echo -e "${BLUE}Pre-commit hooks are currently disabled.${NC}"
        
        # Ask if user wants to re-enable
        read -p "Do you want to re-enable pre-commit hooks? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Rename the pre-commit hook back to enable it
            mv .git/hooks/pre-commit.disabled .git/hooks/pre-commit
            echo -e "${GREEN}Pre-commit hooks have been re-enabled.${NC}"
        else
            echo "No changes made. Hooks remain disabled."
        fi
    else
        echo -e "${YELLOW}Pre-commit hooks are not installed.${NC}"
        echo -e "Run 'npm run security:setup' to install them."
    fi
fi