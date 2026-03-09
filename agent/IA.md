# Information Architecture Guidelines

Use this guide to place content consistently in the docs tree.

## Top-Level Sections

- `content/00.zksync-network/**`
  - developer onboarding, environment setup, quickstart guides, tooling, custom features
- `content/10.zk-stack/**`
  - chain stack components, prividium features, customizations, chain operation info, guides for running a chain locally
- `content/20.zksync-protocol/**`
  - protocol internals, APIs, contracts, security, VM and architecture details

## Audience by Top-Level Section

### `00.zksync-network` (ZKsync Network)

- Primary audience:
  - blockchain application developers and Web3 developers building a first app or learning ZKsync-specific features and tools
- Secondary audience:
  - less technical users learning what ZKsync is and the different chains
- Assumed prerequisites:
  - familiarity with EVM tooling
- Primary user goals:
  - deploy a contract
  - learn the ZKsync network of chains
- What this section should avoid:
  - assuming users already know ZKsync is a multi-chain network
  - assuming users already know ZKsync-specific features

### `10.zk-stack` (ZK Stack)

- Primary audience:
  - chain operators
- Secondary audience:
  - DevOps engineers
- Assumed prerequisites:
  - familiarity with Ethereum node operations
  - basic DevOps practices
- Primary user goals:
  - launch a ZKsync chain locally for testing
- What this section should avoid:
  - `TODO: define anti-goals with team`

### `20.zksync-protocol` (ZKsync Protocol)

- Primary audience:
  - senior engineers
- Secondary audience:
  - advanced Solidity developers
- Assumed prerequisites:
  - `TODO: define required protocol-level background`
- Primary user goals:
  - understand ZKsync on-chain contracts and APIs
- What this section should avoid:
  - `TODO: define anti-goals with team`

## Naming Conventions

- file names: kebab-case, concise, descriptive
- page titles: short and task-oriented; avoid vague titles like "Overview 2"
- nav titles: user-facing and unambiguous; prefer consistency with existing section terms

## Placement Rules

- Prefer editing an existing page when the request is a small extension.
- Create a new page when:
  - content exceeds ~30% of an existing page, or
  - audience/goal differs significantly, or
  - page would otherwise mix unrelated tasks/concepts.
- Create a new landing page only when multiple sibling pages need a common index.

## Duplication Control

- Keep one canonical page per concept ("single source page").
- On non-canonical pages, add short summaries plus links to the canonical page.
- Do not duplicate long procedural steps across multiple pages.

## Agent Placement Checklist

1. Identify user goal and target section.
2. Search for nearest existing canonical page.
3. Decide: patch existing page vs create new page.
4. Confirm navigation impact is minimal and justified.
5. Add/adjust cross-links to avoid orphan pages.
