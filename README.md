# Therapy Playwright

End-to-end tests for the Therapy UI using [Playwright](https://playwright.dev/) and TypeScript.

## Prerequisites

- Node.js 18+ (LTS recommended)
- Access to the target app URL (QA/UAT)
- SFTP credentials (for ARDB / EDI835 ingest tests)
- MongoDB connection (for task polling in dashboard flows)
- Local fixture files (not stored in git — see [Fixtures](#fixtures))

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser
npm run pw:install

# 3. Configure environment
cp .env.example .env
# Edit .env with real BASE_URL, login, SFTP, and MongoDB values

# 4. Add fixture files locally (see below)
# Place files under fixtures/ — they are gitignored
```

### Environment

Copy `.env.example` → `.env` and fill in:

| Variable | Purpose |
|---|---|
| `BASE_URL` | Therapy app URL |
| `LOGIN_PATH` | Login route (default `/login`) |
| `LOGIN_USERNAME` / `LOGIN_PASSWORD` | Test user credentials |
| `SFTP_*` | Host, port, username, password for file drops |
| `MONGODB_URI` / `MONGODB_DB` | MongoDB connection for task polling |
| `MONGODB_TASKS_COLLECTION` | Tasks collection name (default `tasks`) |

Never commit `.env` or real credentials.

### Fixtures

Fixture files (ARDB `.xlsx`, EDI835 `.edi`) can contain sensitive billing/claim data and **must not be committed**.

1. Obtain fixtures from your team’s secure share (not from git).
2. Create a local `fixtures/` folder and place the files there.
3. Point env vars at those files (do not hardcode names in docs or commits):

| Variable | Purpose |
|---|---|
| `ARDB_FIXTURE` | Local ARDB filename under `fixtures/` |
| `ARDB_REMOTE_PATH` | Remote SFTP path for the ARDB drop |
| `EDI835_FIXTURE` | Local EDI835 filename under `fixtures/` |
| `EDI835_REMOTE_PATH` | Remote SFTP path for the EDI835 drop |

The entire `fixtures/` directory is gitignored.

## Project structure

```text
pages/          # Page objects (Login, Dashboard, TaskDetails, …)
tests/          # Specs (login.test.ts, dashboard.test.ts)
plugins/        # SFTP upload + MongoDB helpers
fixtures/       # Local test data only (gitignored)
playwright.config.ts
```

## Running tests

```bash
# All tests
npm test

# Login suite
npm run test:login

# Dashboard / ingest + on-hold flow
npm run test:dashboard

# Headed / UI / debug
npm run test:headed
npm run test:ui
npm run test:debug

# Typecheck
npm run typecheck

# HTML report
npm run report
```

## Notes

- Tests load env via `dotenv` (`playwright.config.ts` and plugins).
- Dashboard ingest tests upload fixtures over SFTP, poll MongoDB for tasks, then drive Login → Dashboard → Task Details.
- Do not put real patient, provider, or claim identifiers in committed code or docs — use synthetic values only.
