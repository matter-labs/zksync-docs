# Sources of Truth and Citation Rules

This policy defines what counts as evidence for agent-generated docs changes.

## Source Hierarchy

1. Primary (highest trust):
   - repository content, code, config, and committed specs
   - tutorial folders and checked-in examples
2. Secondary:
   - linked PRDs/specs/release notes/issues from authoritative systems
3. Not a source of truth:
   - unlinked chat snippets
   - opinions without references
   - ambiguous requests without supporting context

## Citation Requirements

For each non-trivial claim, cite at least one source.

- Repo citation format:
  - `<path>` + section heading or nearby text marker
  - Example: `content/10.zk-stack/20.running/foo.md` ("Prerequisites")
- External citation format:
  - full URL + short context note
  - Example: `https://...` (release notes section "Breaking changes")

## Missing Source Behavior

If no sources are provided:

- draft in best-effort mode only
- add `TODO: verify` for uncertain factual claims
- avoid authoritative language for unknown behavior
- list concrete follow-up questions in PR description

## Conflict Resolution

When sources disagree:

- prefer primary repo evidence over secondary sources
- call out the conflict in PR notes
- request maintainer confirmation before asserting a final claim
