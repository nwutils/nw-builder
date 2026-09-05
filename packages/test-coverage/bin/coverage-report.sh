#!/usr/bin/env bash
#
# Reads a Node.js `--experimental-test-coverage` run's raw output on stdin,
# extracts the coverage table between its "start of coverage report" /
# "end of coverage report" markers, and prints a GitHub-flavored markdown
# table of it to stdout.
#
# Usage:
#   npm run test --workspace=<workspace> | coverage-report.sh <name> <os> > report.md

set -uo pipefail

name="${1:?usage: coverage-report.sh <name> <os>}"
os="${2:?usage: coverage-report.sh <name> <os>}"

raw_input="$(cat)"

coverage_section="$(printf '%s\n' "$raw_input" \
  | sed 's/\x1b\[[0-9;]*m//g' \
  | awk '
      /start of coverage report/ {printing=1; next}
      /end of coverage report/   {printing=0}
      printing
    ')"

echo "### 📊 ${name} Coverage Report — ${os}"
echo
echo "| File | Line % | Branch % | Funcs % | Uncovered Lines |"
echo "|------|--------|----------|---------|------------------|"
printf '%s\n' "$coverage_section" \
  | grep '|' \
  | grep -vE "file\s*\|\s*line|----" \
  | while read -r line; do
      clean=$(echo "$line" | sed 's/^ℹ\s*//' | tr -s ' ')
      echo "| ${clean// | / | } |"
    done
echo
