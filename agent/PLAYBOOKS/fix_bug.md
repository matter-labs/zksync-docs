# Playbook: Fix Docs Bug

## Objective

Resolve a specific docs defect (broken link, typo, anchor mismatch, or factual error) with the smallest safe change.

## Steps

1. Reproduce or locate the reported issue.
2. Confirm expected behavior from source evidence.
3. Isolate the minimal file and line-level patch.
4. Apply the fix without unrelated refactors.
5. Verify local consistency (anchors, link paths, formatting).
6. Run deterministic checks.
7. Summarize root cause and fix verification in PR notes.

## Output Checklist

- issue is demonstrably fixed
- diff is narrowly scoped
- no regressions introduced in nearby content
