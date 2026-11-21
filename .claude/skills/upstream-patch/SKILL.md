---
name: upstream-patch
description: Send a build-tools patch upstream to NW.js. Applies a patch from packages/build-tools/issues/ onto the user's fork of the matching nwjs repository (nw.js, chromium.src, node or v8) and opens a pull request to nwjs, or, for chromium.src, which closes every pull request, posts the patch on the NW.js issue. Use when asked to upstream, submit or send a patch to NW.js.
argument-hint: <patch file or issue folder> [path to the fork's checkout]
---

# Send a build-tools patch upstream

Patches in `packages/build-tools/issues/<issue>/patches/<repository>/` are made
with `git format-patch` at the exact revision NW.js builds from (see "Issues" in
`packages/build-tools/README.md`), so they apply to the nwjs repositories as
they are. This skill applies one onto the user's fork and opens the pull
request.

The arguments are: $ARGUMENTS

## 1. Find the patch and its repository

- The argument is a `.patch` file, or an issue folder (`issues/8393`,
  `issues/build`); for a folder, list its patches and ask which to send if
  there's more than one.
- The repository is the patch's parent folder: `nw.js`, `chromium.src`, `node`
  or `v8`, for `github.com/nwjs/<repository>`.
- The issue is the issue folder's name. `build` holds build fixes, which have
  no NW.js issue.
- Read the patch: its `Subject:` is the pull request title, its message the
  body, and a `Refs: nwjs/nw.js#<n>` line names the issue.

## 2. Find the user's fork

- Use the checkout path from the arguments, or ask for it. It must be a git
  checkout of the user's fork of `nwjs/<repository>`. If they have none, offer
  to fork with `gh repo fork nwjs/<repository> --clone=false` and clone it; for
  chromium.src, clone it sparsely and without history (see the README), never
  in full.
- Check `gh repo view <origin> --json parent` names `nwjs/<repository>` as the
  parent.
- Add the upstream remote if it's missing:
  `git remote add upstream https://github.com/nwjs/<repository>`.
- Stop if the checkout has uncommitted changes; don't stash or discard them.

## 3. Apply the patch on a new branch

- Base: `upstream/main`. NW.js builds chromium.src, node and v8 from `main`,
  and develops nw.js on `main` (each release is tagged `nw-v<version>`).
  Fetch only that branch: `git fetch upstream main` (add `--depth=1` for a
  shallow or sparse checkout).
- `git switch -c nwjs-<issue>-<short-slug-of-subject> upstream/main`
- `git am --3way <patch>` keeps the patch's author, date and message.
- If it doesn't apply, `git am --abort`, switch back to the previous branch,
  and report the conflicting files: upstream has moved on, and the patch
  needs updating in nw-builder first.

## 4. Confirm, push and open the pull request

Show the user the commit (`git show --stat HEAD`) and what will happen next,
and wait for their go-ahead: pushing and opening a pull request are public.

- Push to the fork: `git push -u origin <branch>`. Never force-push.
- **nw.js, node, v8:** open the pull request:

  ```sh
  gh pr create --repo nwjs/<repository> --base main --head <fork-owner>:<branch> \
    --title "<Subject>" --body "<message, ending with Refs: nwjs/nw.js#<n>>"
  ```

- **chromium.src:** don't open a pull request. nwjs/chromium.src inherited
  Chromium's workflow that closes every pull request when it's opened. Offer
  instead to comment on `nwjs/nw.js#<issue>` (for `build`, a new issue on
  nwjs/nw.js titled with the subject) with a short summary, a link to the
  commit on the fork, and the patch in a ```diff block.

Keep titles and bodies short. Use `Refs:`, never `Fixes`/`Closes`, unless the
user asks: a closing keyword would close the NW.js issue when merged.

## 5. Report

Give the user the branch, the pull request or comment URL, and, if the patch
didn't apply, what needs updating. Switch the checkout back to the branch it
was on.
