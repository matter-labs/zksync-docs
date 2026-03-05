# Playbook: New Page Request

## Objective

Create a new documentation page that satisfies request intent without violating policy scope.

## Steps

1. Read issue request, DoD, and any linked sources.
2. Identify target section using `agent/IA.md`.
3. Validate whether a new page is necessary (vs patching an existing page).
4. Draft outline:
   - purpose
   - audience
   - prerequisites
   - procedure/content body
   - next steps
5. Draft content with citations for technical claims.
6. Add `TODO: verify` for unsupported factual claims.
7. Add or update cross-links so the page is discoverable.
8. Run deterministic checks (lint/build/link checks).
9. Prepare PR notes with sources and uncertainty markers.

## Output Checklist

- new page path is correct for target IA section
- no forbidden paths changed
- DoD checklist is addressed in PR body
