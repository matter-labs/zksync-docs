# Docs Automation Operating Model

This document defines the issue-to-PR operating protocol for docs automation.

## Scope

- Repository: `matter-labs/zksync-docs`
- Automation role: create and update docs PRs
- Merge policy: manual merge only

## State Model

### Issue labels

| Label | Meaning |
| --- | --- |
| `needs-triage` | New request queued for maintainer triage. |
| `needs-info` | Missing required fields; agent must not run. |
| `agent:ready` | Request is clear enough for automation. |
| `agent:running` | Workflow execution in progress. |
| `agent:blocked` | Workflow cannot continue; human input required. |
| `agent:pr-open` | Workflow opened a PR. |

### PR labels

| Label | Meaning |
| --- | --- |
| `agent:generated` | PR was opened by automation. |
| `agent:patch` | Agent can push follow-up patches to the PR branch. |
| `ui:accept-baseline` | Visual baseline updates are intentionally accepted. |
| `agent:large` | Large diff is explicitly approved. |
| `docs:not-needed` | Reviewers approved skipping docs updates. |

Authoritative colors/descriptions live in [labels.md](./labels.md).

## Transition Rules

1. New docs request starts with `needs-triage`.
2. If required intake fields are missing, set `needs-info` and do not set `agent:ready`.
3. When triage is complete and scope is acceptable, remove `needs-triage`/`needs-info` and set `agent:ready`.
4. When the workflow starts, move `agent:ready` to `agent:running`.
5. If automation cannot proceed, set `agent:blocked` with a concrete request for missing inputs.
6. If automation opens a PR, set `agent:pr-open` on the issue and `agent:generated` on the PR.

## Escalation Paths

- Missing request details:
  - Add `needs-info`
  - Provide exact missing fields and an example response format
- Policy or scope violation:
  - Add `agent:blocked`
  - Explain blocked files/scope and required split or approval path (`agent:large`)
- Source ambiguity:
  - Request concrete source links
  - Allow best-effort drafting only with clear uncertainty markers

## Done Criteria

Use acceptance templates from [definition-of-done.md](./definition-of-done.md).

## Related Docs

- [ISSUE_TRIAGE.md](../../ISSUE_TRIAGE.md)
- [triage.md](./triage.md)
