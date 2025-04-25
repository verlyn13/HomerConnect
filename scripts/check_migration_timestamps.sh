#!/usr/bin/env bash
# Check for duplicate Supabase migration timestamps
set -euo pipefail
cd supabase/migrations

# Extract prefix (timestamp) before first underscore and find duplicates
duplicates=$(ls | cut -d_ -f1 | sort | uniq -d)
if [[ -n "$duplicates" ]]; then
  echo "Error: duplicate migration timestamps detected: $duplicates"
  exit 1
fi
echo "No duplicate migration timestamps found."