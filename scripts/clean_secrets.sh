#!/bin/bash
# Script to clean secrets from the git repository
# This script helps remove sensitive files from git history

# Stop on errors
set -e

echo "======================================================"
echo "  WARNING: This script will rewrite git history"
echo "  Make sure all collaborators are aware before running"
echo "======================================================"
echo ""
echo "This script will permanently remove .env files from git history."
echo "Before continuing, ensure you have:"
echo "  1. Rotated all exposed credentials"
echo "  2. Backed up your repository"
echo "  3. Informed all collaborators"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Operation cancelled."
    exit 1
fi

# Check for BFG or git-filter-repo
if command -v bfg >/dev/null 2>&1; then
    echo "Using BFG Repo-Cleaner..."

    # Create a temporary directory for the mirror
    TEMP_DIR=$(mktemp -d)
    echo "Creating mirror in $TEMP_DIR"

    # Get the remote URL
    REMOTE_URL=$(git remote get-url origin)

    # Clone a mirror of the repository
    git clone --mirror "$REMOTE_URL" "$TEMP_DIR/repo.git"
    cd "$TEMP_DIR/repo.git"

    # Use BFG to remove the files
    echo "Removing .env files from git history..."
    bfg --delete-files .env
    bfg --delete-files "supabase/.env"
    bfg --delete-files ".env.development"
    bfg --delete-files ".env.production"

    # Clean up
    echo "Cleaning up refs and garbage collecting..."
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive

    # Confirm before pushing
    echo ""
    echo "==========================================================="
    echo "  WARNING: About to push rewritten history to remote"
    echo "  This will force-push and might disrupt collaborators' work"
    echo "==========================================================="
    echo ""
    read -p "Push rewritten history? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo "Pushing changes..."
        git push --force
        echo "History has been rewritten and pushed."
    else
        echo "Changes were not pushed. If you want to push manually, run:"
        echo "cd $TEMP_DIR/repo.git && git push --force"
    fi

elif command -v git-filter-repo >/dev/null 2>&1; then
    echo "Using git-filter-repo..."

    # Create a fresh clone
    TEMP_DIR=$(mktemp -d)
    echo "Creating clean clone in $TEMP_DIR"

    # Get the remote URL
    REMOTE_URL=$(git remote get-url origin)

    # Clone the repository
    git clone "$REMOTE_URL" "$TEMP_DIR/repo"
    cd "$TEMP_DIR/repo"

    # Use git-filter-repo to remove the files
    echo "Removing .env files from git history..."
    git filter-repo --invert-paths --path .env --path supabase/.env --path .env.development --path .env.production

    # Confirm before pushing
    echo ""
    echo "==========================================================="
    echo "  WARNING: About to push rewritten history to remote"
    echo "  This will force-push and might disrupt collaborators' work"
    echo "==========================================================="
    echo ""
    read -p "Push rewritten history? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo "Pushing changes..."
        git push origin --force --all
        git push origin --force --tags
        echo "History has been rewritten and pushed."
    else
        echo "Changes were not pushed. If you want to push manually, run:"
        echo "cd $TEMP_DIR/repo && git push origin --force --all && git push origin --force --tags"
    fi

else
    echo "ERROR: Neither BFG nor git-filter-repo was found."
    echo "Please install one of these tools first:"
    echo "  - BFG: https://rtyley.github.io/bfg-repo-cleaner/"
    echo "  - git-filter-repo: pip install git-filter-repo"
    exit 1
fi

echo ""
echo "Process completed."
echo ""
echo "IMPORTANT: Tell all collaborators to run the following commands:"
echo "git fetch origin"
echo "git reset --hard origin/main  # or your main branch name"
echo ""
echo "Remember to update all exposed credentials!"
