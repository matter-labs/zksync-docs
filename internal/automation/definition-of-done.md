# Definition of Done Templates for Docs Requests

Use these templates in docs requests. Copy the relevant checklist into the issue's `Definition of Done` field.

## New Page Template

- [ ] Page states purpose and intended audience.
- [ ] Prerequisites are explicit and complete.
- [ ] Steps are sequenced and reproducible.
- [ ] All technical claims are backed by sources or tagged with `TODO: verify`.
- [ ] Includes a suggestion of which section of the docs this new page should be included into.
- [ ] Internal links and anchors resolve in preview/build.

## Update Template

- [ ] Updated sections match the referenced change source (PR, commit, release, or spec).
- [ ] Outdated claims are removed or corrected.
- [ ] Links and anchors remain valid after edits.
- [ ] Terminology matches glossary/style conventions.
- [ ] Preview build succeeds without docs lint regressions.

## Fix Template

- [ ] The identified issue is fixed (broken link, typo, anchor, or inaccurate statement).
- [ ] Fix is minimal and does not introduce unrelated edits.
- [ ] Related page rendering is unchanged except for the intended fix.
- [ ] Build and docs checks pass.
- [ ] No regression in existing documentation behavior.

## Migrate Template

- [ ] Old location and new location are documented.
- [ ] Redirects or replacement links are updated as needed.
- [ ] Navigation placement is updated without duplication.
- [ ] Cross-references from dependent pages are updated.
- [ ] Build and link checks pass.
