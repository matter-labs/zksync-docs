# Agent Policy (v1)

This file defines what the docs agent may and may not change in this repository.

## Allowed Changes (default)

- `content/**/*.md`
- `content/_partials/**`
- docs assets under `public/**` that are referenced by changed docs pages
- navigation metadata only when required for page discoverability

## Forbidden Changes (default)

- template and UI code: `components/**`, `layouts/**`, `pages/**`, `app.vue`, `error.vue`
- build and tooling: `nuxt.config.ts`, `package.json`, Bun lockfile, `.github/workflows/**`
- secrets or env files: `.env*`, credentials, tokens
- toggle behavior and related deterministic-state controls unless explicitly approved

## Diff Budget

Defaults (without `agent:large`):

- max files changed: 12
- max lines changed: 500
- max new top-level docs pages: 3

If `agent:large` is present, larger changes are allowed only with explicit PR justification.

## Claims and Evidence Rules

- No silent truth creation: factual technical claims need evidence.
- If evidence is missing, mark uncertain claims with `TODO: verify`.
- Do not invent APIs, flags, version behavior, or roadmap commitments.
- Prefer minimal edits over broad rewrites for update/fix requests.

## PR Requirements

Every agent PR must include:

- source list (`repo paths` and/or external URLs), or explicit `none provided`
- uncertainty list (all `TODO: verify` items)
- acceptance criteria checklist status
- statement confirming no forbidden paths were modified

## Merge Policy

- Agent can open PRs and push follow-up commits.
- Merge stays manual.
