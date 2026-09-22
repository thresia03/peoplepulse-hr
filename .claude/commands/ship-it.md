Plan and then implement: $ARGUMENTS
Follow these four phases in order. Do NOT skip or merge phases.
PHASE 1 — EXPLORE
Read only the files relevant to this task. Identify the existing filter
pattern and every file that participates in it. Read the matching test
files. Do NOT write any code in this phase.
PHASE 2 — PLAN
Write a file-by-file implementation plan, bottom up, in this order:
 1. src/types/ — any type or union that must change
 2. src/services/ — the pure function holding the business rule
 3. src/hooks/ — how the new filter is wired into state
 4. src/components/ — the UI, using ONLY components and variants that
 already exist in docs/design-system.md
 5. tests/ — the test cases, including the edge cases
For each file state: the exact path, what you will add, and why.
Name every convention from CLAUDE.md that applies to this change.
PHASE 3 — WAIT FOR APPROVAL
Present the plan, then ask exactly:
 "Does this plan look right? Reply YES to proceed, or describe changes."
STOP HERE. Do NOT write any production code until you receive YES.
PHASE 4 — IMPLEMENT
Only after explicit approval. Implement one layer at a time in the order
above. Business logic belongs in src/services/ and nowhere else.
After the last layer, run: npm run build && npm test
Report any failure before declaring the work done.