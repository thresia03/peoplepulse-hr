#!/usr/bin/env bash
# Pre-tool-use hook: audits each matching Bash attempt and blocks selected patterns.
# Input is supplied as JSON on stdin.
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DECISION="allowed"
# Apply an additional hook-level check to the Bash command.
if [[ "$TOOL_NAME" == "Bash" ]]; then
  if echo "$COMMAND" | grep -qE '(^|[[:space:]])sudo([[:space:]]|$)|chmod[[:space:]]+777([[:space:]]|$)|dd[[:space:]]+if='; then
    DECISION="blocked"
    jq -cn --arg ts "$TIMESTAMP" --arg tool "$TOOL_NAME" --arg command "$COMMAND" --arg decision "$DECISION" '{ts:$ts,tool:$tool,command:$command,decision:$decision}' >> .claude/hooks/audit.log
    echo "BLOCKED by pre-tool-use hook: dangerous pattern detected" >&2
    exit 2
  fi
fi
jq -cn --arg ts "$TIMESTAMP" --arg tool "$TOOL_NAME" --arg command "$COMMAND" --arg decision "$DECISION" '{ts:$ts,tool:$tool,command:$command,decision:$decision}' >> .claude/hooks/audit.log
exit 0
