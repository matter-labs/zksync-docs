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
- always check if an existing partial from the `content/_partials` folder can be used in place of writing new documentation.
- use `::content-switcher` for variant-specific instructions
- use `::card-group` for grouped navigation cards
- use callouts intentionally:
  - note: `::callout{icon="i-heroicons-light-bulb"}`
  - warning: `::callout{icon="i-heroicons-exclamation-triangle" color="amber"}`
- use `:code-import` to import example code from the `examples` folder.
- whenever possible, add or reuse code examples to the `examples` folder and import them using `:code-import`
  instead of hardcoding the example directly in the markdown file
- use `ANCHOR:<tag-name>` comments to specify subsections of code in the `examples` folder to import to a page.
  To import subsections of code using `:code-import`, add `:<tag-name>` at the end of the filepath.
- for any bash commands, use `::code-group` to show the command using `npm`, `yarn`, `pnpm`, and `bun`.
- for very long code examples, nest the code example inside a `::drop-panel` component.
- for images or videos, use `::centered-container` to center the media.

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
