#!/bin/bash
# Script to set up pre-commit hooks for secret detection

# Stop on errors
set -e

echo "Setting up pre-commit hooks for HomerConnect..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "pre-commit not found. Installing..."
    pip install pre-commit
fi

# Initialize the secrets baseline
echo "Initializing detect-secrets baseline..."
if ! command -v detect-secrets &> /dev/null; then
    echo "detect-secrets not found. Installing..."
    pip install detect-secrets
fi

# Scan for secrets and create a baseline
echo "Creating baseline by scanning for secrets..."
detect-secrets scan --exclude-files "package-lock.json|yarn.lock|.*\\.min\\.js|.*\\.min\\.css|.*\\.svg" > .secrets.baseline

# Add custom rules to the baseline to ignore integrity hashes
echo "Updating baseline with custom rules..."
cat > .custom-secrets-config.json << EOF
{
  "filters": {
    "custom_filters": ["scripts/detect_secrets_filters.py"],
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

# Audit the baseline to approve any intentional secrets or test values
echo "Auditing secrets baseline..."
echo "NOTE: Running interactive audit. For each potential secret:"
echo "  - Enter 'y' if it's a real secret that should be removed"
echo "  - Enter 'n' if it's a false positive (like a test value)"
detect-secrets audit .secrets.baseline || echo "Skipped audit - continue to use baseline"

# Install the pre-commit hooks
echo "Installing pre-commit hooks..."
pre-commit install

echo "Pre-commit hooks have been set up successfully!"
echo ""
echo "These hooks will help prevent accidental commits of sensitive data."
echo "To run the checks manually: pre-commit run --all-files"
