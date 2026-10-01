#!/usr/bin/env bash
# Post-tool-use hook: records selected fields from successful tool events.
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
TOOL_INPUT=$(echo "$INPUT" | jq -c '.tool_input')
TOOL_RESPONSE=$(echo "$INPUT" | jq -c '.tool_response')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // ""')
TOOL_USE_ID=$(echo "$INPUT" | jq -r '.tool_use_id // ""')
CWD=$(echo "$INPUT" | jq -r '.cwd // ""')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ENTRY=$(jq -cn --arg ts "$TIMESTAMP" --arg session "$SESSION_ID" --arg toolUseId "$TOOL_USE_ID" --arg cwd "$CWD" --arg tool "$TOOL_NAME" --argjson input "$TOOL_INPUT" --argjson response "$TOOL_RESPONSE" '{ts:$ts,session_id:$session,tool_use_id:$toolUseId,cwd:$cwd,tool:$tool,input:$input,response:$response}')
echo "$ENTRY" >> .claude/hooks/audit-structured.log
exit 0
