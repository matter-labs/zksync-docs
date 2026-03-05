# AI Agent Entry Guide

This repository is a Nuxt-based documentation site for ZKsync.
Use this file as the entrypoint, then follow referenced files for detailed rules.

## Operating Modes

1. Manual AI mode (no issue labels/workflow):
   - Follow `agent/*` guidance and execute tasks directly in this repo.
2. Automation mode (issue/label driven):
   - Follow `internal/automation/*` plus `agent/*`.

## Canonical References

- Global operating model: [internal/automation/overview.md](internal/automation/overview.md)
- Triage process: [internal/automation/triage.md](internal/automation/triage.md)
- Label taxonomy: [internal/automation/labels.md](internal/automation/labels.md)
- Agent policy and scope: [agent/POLICY.md](agent/POLICY.md)
- Source and citation rules: [agent/SOURCES.md](agent/SOURCES.md)
- Writing and formatting rules: [agent/STYLE_GUIDE.md](agent/STYLE_GUIDE.md)
- IA placement rules: [agent/IA.md](agent/IA.md)
- Terminology: [agent/GLOSSARY.md](agent/GLOSSARY.md)
- Request template: [.github/ISSUE_TEMPLATE/docs_request.yml](.github/ISSUE_TEMPLATE/docs_request.yml)
- Triage checklist: [ISSUE_TRIAGE.md](ISSUE_TRIAGE.md)

## Minimal Requirements

- Keep diffs minimal and task-scoped.
- Do not invent technical facts, APIs, versions, or flags.
- Back factual claims with sources, or mark `TODO: verify`.
- Keep terminology consistent with `agent/GLOSSARY.md`.
- Merge stays manual.

## Local Validation Commands

- Install dependencies once: `bun install --frozen-lockfile`
- Markdown lint: `bun run lint:markdown`
- Prettier check: `bun run lint:prettier`
- Spell check: `bun run lint:spelling`
- ESLint: `bun run lint:eslint`
- Build: `bun run build`
- Full local gate: `bun run ci:check`

## Check Selection

- Docs content only (`content/**`): run `lint:markdown`, `lint:spelling`, and `lint:prettier`.
- Docs + assets (`public/**`): run docs checks and `bun run build`.
- Any code/config/workflow change: run `bun run ci:check` and `bun run build`.
- Before opening a PR: run `bun run ci:check` and `bun run build`.

## Autonomous Workflow (Manual AI Mode)

1. Classify task (`new`, `update`, `fix`, `migrate`).
2. Apply scope rules from `agent/POLICY.md`.
3. Gather sources and citation evidence from `agent/SOURCES.md`.
4. Place content using `agent/IA.md`.
5. Write/edit using `agent/STYLE_GUIDE.md` and `agent/GLOSSARY.md`.
6. Run the required local checks.
7. Prepare PR notes with source list, uncertainty list, and check results.

## Automation Workflow Entry (Optional)

If you are using issue-driven automation, start with:

1. [.github/ISSUE_TEMPLATE/docs_request.yml](.github/ISSUE_TEMPLATE/docs_request.yml)
2. [ISSUE_TRIAGE.md](ISSUE_TRIAGE.md)
3. [internal/automation/overview.md](internal/automation/overview.md)
