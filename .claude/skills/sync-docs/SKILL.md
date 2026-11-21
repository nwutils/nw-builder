---
name: sync-docs
description: Bring JSDoc comments and Markdown docs (package READMEs) up to date with a code change. Reads the diff against main, finds what changed in exported functions, CLI commands and options, and updates the matching JSDoc and README text. Use before opening a pull request, or when asked to update, sync or check the docs.
argument-hint: "[base ref, default main] [package]"
---

# Keep the docs in sync with the code

Lint and types already catch JSDoc that no longer matches the code's shape
(`npm run lint`, `npm run type`): parameter names and order, missing
`@param`/`@returns`/`@yields`, wrong types. This skill handles what tools
can't: whether the words still tell the truth.

The arguments are: $ARGUMENTS

## 1. Find what changed

- Diff the current branch against the base (default `main`), including
  uncommitted changes: `git diff <base>...` and `git diff`. Limit it to the
  package if one is given.
- List the changes that docs describe:
  - exported functions and their parameters, defaults, return values and
    errors;
  - CLI commands, options, defaults and usage text (`--help`);
  - environment variables, workflow inputs and file layouts the README shows;
  - behaviour that a README section or JSDoc description explains.

## 2. Update the JSDoc

For each changed function, read its JSDoc next to the code and fix what's
wrong: the description, each `@param` description, defaults, `@returns`,
`@throws`. Write for the caller: what it does and why, not how. Don't add
JSDoc to functions that have none, and don't reword text that's still true.

## 3. Update the Markdown

Search the docs for every changed name: `git grep -n "<name>" -- "*.md"`,
covering the package README, the root README and `.claude/skills`. Update
command tables, option lists, examples and explanations to match. Keep each
README's style and length: short sentences, no internals the code's comments
already cover. Run the commands the docs show, where they're safe to run, to
check they still work.

## 4. Check and report

- `npx prettier --write` the changed files, then `npm run lint` and
  `npm run type --workspaces --if-present`.
- Leave code alone: if the docs describe intended behaviour that the code
  doesn't do, report it instead of changing either.
- Tell the user which files changed and why, and anything you weren't sure
  about.
