# Prompt Template: PR Description

Write a PR description for an agent-generated docs change.

## Required Sections

1. Summary
2. Request Link
3. Scope of Changes
4. Acceptance Criteria Status
5. Sources Used
6. Uncertainties (`TODO: verify`)
7. Validation Checks

## Required Conventions

- use direct, technical language
- avoid marketing phrasing
- keep bullets concise and specific
- use canonical terminology from `agent/GLOSSARY.md`
- explicitly state `none provided` when no sources were supplied
- if claims are uncertain, list each uncertainty as an actionable question

## PR Body Template

```md
## Summary
- <what changed and why>

## Request Link
- Addresses #<issue_number>

## Scope of Changes
- <file/path group and purpose>

## Acceptance Criteria Status
- [x] <criterion met>
- [ ] <criterion pending or blocked>

## Sources Used
- <repo path + section reference>
- <external URL + short note>
or
- none provided

## Uncertainties (TODO: verify)
- <claim/question>

## Validation Checks
- <lint/build/linkcheck results>
```
