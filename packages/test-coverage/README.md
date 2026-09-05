# @nwutils/test-coverage

Internal CI helper, not published to npm. `bin/coverage-report.sh` reads a `node:test --experimental-test-coverage` run's raw output on stdin and renders the coverage table between its `start of coverage report` / `end of coverage report` markers as a GitHub-flavored markdown table on stdout.

Used by `.github/workflows/ci.yml` to post a per-package, per-OS coverage comment on pull requests for every `./packages/*` workspace that uses `node:test` (cli, doctor, getter, runner). nw-builder uses vitest and reports coverage via [davelosert/vitest-coverage-report-action](https://github.com/davelosert/vitest-coverage-report-action) instead.

## Usage

```sh
npm run test --workspace=@nwutils/<name> | packages/test-coverage/bin/coverage-report.sh <name> <os> > report.md
```
