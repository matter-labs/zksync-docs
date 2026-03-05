# Issue Triage for Docs Automation

This guide defines when a docs request can move from intake to agent execution.

Reference docs:

- `internal/automation/overview.md` for full operating model and escalation rules.
- `internal/automation/labels.md` for label colors/descriptions and sync command.

## Required Labels

- `needs-triage`: default state for new docs requests.
- `needs-info`: request is missing required detail.
- `agent:ready`: request is clear and can be processed by automation.
- `agent:running`: automation currently executing.
- `agent:blocked`: automation cannot continue without input.
- `agent:pr-open`: automation created a PR.

## Triage Checklist

1. Confirm the issue was submitted through `.github/ISSUE_TEMPLATE/docs_request.yml`.
2. Confirm `Definition of Done` has at least one concrete checklist item.
3. If request type is `update`, confirm `What Changed?` references a PR, commit, release note, or equivalent.
4. Confirm target section is appropriate.
5. Confirm at least one source is provided when factual correctness matters. If no source exists, the request can proceed only as best-effort draft content.
6. Confirm scope is reasonable for one PR. If not, split into follow-up requests.

## Label Transitions

- Intake:
  - Add `needs-triage` if missing.
- Missing data:
  - Add `needs-info`.
  - Remove `agent:ready` if present.
  - Comment with exact missing fields.
- Ready to run:
  - Remove `needs-triage` and `needs-info`.
  - Add `agent:ready`.
- During execution:
  - Automation swaps `agent:ready` -> `agent:running`.
- Blocked execution:
  - Add `agent:blocked`.
  - Keep issue open and request concrete inputs.
- PR opened:
  - Add `agent:pr-open`.
  - Remove `agent:running`.

## Notes

- Empty `Definition of Done` always blocks triage.
- For best-effort drafts without sources, reviewers must expect TODO markers for uncertain claims.
- Merge remains manual even when an agent opens the PR.
