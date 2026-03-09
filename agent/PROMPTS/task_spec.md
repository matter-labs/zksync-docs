# Prompt Template: Task Spec Generation

Generate an `agent_task.json` object for a docs request.

## Inputs

- issue title/body and labels
- parsed issue form fields
- relevant repository context

## Must Produce

- `issue_number`
- `request_type`
- `goal`
- `target_section`
- `target_paths_hint` (optional)
- `sources` (array, can be empty)
- `acceptance_criteria` (non-empty array)
- `constraints`:
  - `allowed_globs`
  - `forbidden_globs`
  - `max_files_changed`
  - `max_lines_changed`
  - `toggle_component_changes_allowed` = `false`
- `draft_policy`:
  - `allow_best_effort_without_sources`
  - `require_todos_for_uncertain_claims`

## Generation Rules

- follow `agent/POLICY.md` for scope and forbidden paths
- follow `agent/SOURCES.md` for source quality interpretation
- if `request_type=update`, require "what changed" evidence
- if sources are missing, enable strict draft policy flags
- never emit empty acceptance criteria

## Output Rules

- output valid JSON only
- do not include prose outside JSON
- ensure deterministic field names and value types
