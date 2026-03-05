# Docs Automation Triage Playbook

This playbook explains how maintainers decide when a docs issue is ready for agent execution.

## Goals

- Keep request quality high before automation starts.
- Prevent overconfident docs claims without evidence.
- Keep agent-generated PR scope reviewable.

## Readiness Criteria

An issue is `agent:ready` only when all checks pass:

1. Structured intake is complete.
2. Definition of done is actionable and testable.
3. Scope fits a single PR unless explicitly split.
4. Update requests include what changed.
5. Sources are provided, or the request explicitly allows best-effort drafting.

## Intake Validation

- Check `Request Type`, `User Goal Statement`, and `Target Section`.
- Check `Definition of Done` for concrete bullets.
- If request type is `update`, ensure `What Changed?` is filled.
- Confirm any risks and stakeholder reviewers are listed when relevant.

If any required item is missing:

- Add `needs-info`.
- Comment with a short missing-items list.
- Do not add `agent:ready`.

## Source Quality Rules

- Preferred sources:
  - in-repo docs/content/code paths
  - linked specs, release notes, PRs, or commits
- Weak sources:
  - opinions without references
  - unlinked chat summaries

When sources are absent but drafting can proceed:

- Allow best-effort draft only.
- Require TODO markers for claims needing verification.
- Add explicit reviewer questions in the PR description.

## Scope Control

Before setting `agent:ready`, verify:

- proposed changes are not broad refactors
- expected file count is modest
- no template/build/tooling changes are required for this request

If the request is too broad, split it into smaller issues and keep the current issue in `needs-triage` or `needs-info` until split.

## Label Flow

1. New request -> `needs-triage`
2. Missing fields -> `needs-info`
3. Ready -> `agent:ready`
4. Automation starts -> `agent:running`
5. Automation blocked -> `agent:blocked`
6. PR opened -> `agent:pr-open`

## Escalation

Escalate to human owners when:

- sources conflict or are outdated
- requested behavior contradicts product or protocol references
- legal/security-sensitive wording is requested
- request requires changes outside docs-authorized paths
