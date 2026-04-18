#!/bin/bash
# Validate tool use - block git commands and destructive operations
# Reads JSON from stdin, checks if tool is run_in_terminal with dangerous commands
# Returns permission decision in JSON format

set -o pipefail

# Read input JSON
input=$(cat)

# Extract tool name and parameters
tool_name=$(echo "$input" | jq -r '.toolName // empty')
command_text=$(echo "$input" | jq -r '.parameters.command // .parameters.args[0] // empty' 2>/dev/null || echo "")

# Check if this is a terminal command
if [[ "$tool_name" == "run_in_terminal" ]]; then
  # List of dangerous patterns to block
  declare -a dangerous_patterns=(
    "^git[[:space:]]"                    # git commands
    "[[:space:]]git[[:space:]]"          # git with pipes/redirects
    " git "                              # git with spaces
    "| git"                              # piped to git
    "rm[[:space:]]-[^-]*r"               # rm -r or rm -rf
    "rm[[:space:]].*-rf"                 # rm -rf in any order
    "^dd[[:space:]]"                     # dd (disk operations)
    "[[:space:]]dd[[:space:]]"           # dd with pipes
    "mkfs"                               # mkfs (filesystem format)
    "shred"                              # shred (secure delete)
    "fdisk"                              # fdisk (partition editing)
    "parted"                             # parted (partition editing)
  )

  # Check each dangerous pattern
  dangerous=false
  for pattern in "${dangerous_patterns[@]}"; do
    if [[ "$command_text" =~ $pattern ]]; then
      dangerous=true
      break
    fi
  done

  if [[ "$dangerous" == true ]]; then
    # Dangerous command detected - ask user for confirmation
    cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "This command is restricted (git, rm -rf, or destructive operation). Confirmation required: '$command_text'"
  }
}
EOF
    exit 0
  fi
fi

# Not a dangerous command - allow it
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
  }
}
EOF
exit 0
