Explore this repository and orient for a developer who has never seen it.
Steps — follow in order, do NOT edit any file:
1. Use Glob to list the root and every immediate subfolder of src/.
2. Read CLAUDE.md, docs/architecture.md, and docs/design-system.md in full.
3. Read src/types/employee.ts and list every field on the Employee type.
4. Use Grep for 'export const' and 'export function' in src/services/
 and src/hooks/ to inventory the public surface of each layer.
5. Trace the ONE existing filter end to end: find where it is defined in
 the service, how the hook consumes it, and where the UI sets it.
Output a structured orientation with exactly these sections:
 WHAT IT IS
 One paragraph: purpose, who uses it, where the data comes from.
 LAYER MAP
 One line per folder under src/ with its single responsibility.
 DATA FLOW
 One line per hop, from mock data to rendered row.
 THE PATTERN TO COPY
 The existing filter, traced file by file with file:line citations.
 This is the template any new filter must follow.
 UNUSED OR INCOMPLETE
 Any type field, prop, or export that is declared but never consumed.
 THREE SURPRISES
 Three things that would surprise a newcomer to this codebase.
Do NOT create, edit, or delete any file.