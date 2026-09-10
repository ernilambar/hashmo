# AGENTS.md

## Overview

`hashmo` is a command-line tool that writes a timestamp-based hash to a file in plaintext, PHP, or JSON format. It is a pure Node.js ES module with no build step, using `minimist` for argument parsing and `node:test` for tests.

## Setup

Use Node.js 22 or later. Install dependencies with the lockfile:

```sh
npm ci
```

No environment variables or additional configuration are required.

## Commands

- Build: none (plain JavaScript, no compile step)
- Test: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`
- Typecheck: none (no TypeScript in this project)

## Conventions

- Use ES module syntax with the `node:` prefix for built-in imports (for example, `node:fs`, `node:path`).
- Keep the CLI entry point and argument parsing in `index.js`, implementation logic in `src/`, and tests in `test/`.
- Preserve the existing callback-based public API for `generateHash` and file helpers; do not silently change return values, callback timing, or observable CLI output.
- Add or update tests under `test/` using `node:test` and `node:assert` whenever behavior changes.
- Do not add runtime dependencies for functionality already available through Node.js built-ins.

## Quality gate

Run these commands in order and confirm every command exits with code 0 before considering the task complete:

```sh
npm ci
npm run lint
npm test
```

Build and typecheck are intentionally omitted because this project has no build or TypeScript step.
