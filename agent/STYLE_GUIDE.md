# Documentation Style Guide (v1)

This guide encodes repository writing standards and user-preferred tone guidance.

## Voice and Tone

- write for developers with direct, professional language
- use second person ("you") for procedures
- prefer imperative phrasing in steps: "Configure", "Run", "Verify"
- use active voice; avoid passive constructions unless necessary
- no marketing language, hype, or vague superlatives
- no emojis

## Sentence and Structure Rules

- one idea per sentence when possible
- target 15-20 words; hard cap 30 words per sentence
- avoid filler phrases and weak openings (for example, "There is/There are")
- use inverted pyramid structure: key point first, details later
- apply progressive disclosure: basics -> standard workflow -> failures -> advanced
- maintain parallel structure in headings and lists

## Required Page Structure

Every new docs page must start with frontmatter:

```yaml
---
title: "Clear, specific, keyword-rich title"
description: "Concise description of page purpose and value"
---
```

## Formatting and Components

- use `1.` for numbered lists in markdown content
- include fenced code blocks with language identifiers
- prefer complete, runnable examples with realistic values
- never include real secrets or tokens
- prefer environment variables over inline secret placeholders
- use partials for reusable content via `:display_partial{path="..."}`
- use `::content-switcher` for variant-specific instructions
- use `::card-group` for grouped navigation cards
- use callouts intentionally:
  - note: `::callout{icon="i-heroicons-light-bulb"}`
  - warning: `::callout{icon="i-heroicons-exclamation-triangle" color="amber"}`

## Link and Accessibility Rules

- use descriptive link text; do not use "click here"
- verify internal links and anchors resolve
- include descriptive alt text for images
- keep heading hierarchy consistent and scannable

## Terminology Rules

- use canonical terms from `agent/GLOSSARY.md`
- define abbreviations on first use
- do not mix synonyms for the same concept inside one page

## Verification Before PR

- run `bun run lint:markdown`
- run `bun run lint:prettier`
- ensure claims are sourced or marked `TODO: verify`
