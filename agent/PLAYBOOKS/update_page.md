# Playbook: Update Existing Page

## Objective

Apply targeted updates that align docs with a verified source change.

## Steps

1. Read request details and extract the "what changed" reference.
2. Locate affected page(s) in `content/**`.
3. Diff existing docs claims against provided sources.
4. Make minimal edits that correct only affected sections.
5. Preserve page structure unless IA changes are necessary.
6. Add citations for updated claims.
7. Mark uncertain claims with `TODO: verify`.
8. Validate links/anchors in edited sections.
9. Run deterministic checks and prepare PR notes.

## Output Checklist

- update scope is minimal and source-aligned
- no invented behavior, APIs, or version claims
- no forbidden files changed
