# JFA-06: Local developer environment

**Not a hosted deployment.** All credentials below are deliberately local demonstration values. Never copy them to Render, Neon, GitHub secrets or a public front end.

Requirements: Node.js 22.16.0; Corepack/pnpm 10.18.3; Docker with Compose.

1. `docker compose up -d postgres mail` starts disposable development Postgres 16 at localhost:55432 and Mailpit at [localhost:8025](http://localhost:8025). No email sending adapter is implemented yet.
2. `corepack pnpm install --no-frozen-lockfile` installs the workspace. JFA-07 will commit and verify the frozen lockfile; this command is not yet reproducible.
3. In a local terminal set `DATABASE_URL=postgresql://jfa_dev:dev_only_password@127.0.0.1:55432/jfa_dev`, then run `corepack pnpm db:migrate`. Never echo a real production URL into shell logs or commit it.
4. For local Next.js readiness checks, copy `apps/web/.env.local.example` to `apps/web/.env.local`. Start `corepack pnpm dev` and visit `http://localhost:3000`.
5. `GET /health` returns 200 for process liveness. `GET /ready` must return 200 only with a reachable database and `0001_core` migration. Clear `DATABASE_URL` and observe 503; point to a missing schema and observe 503.
6. `corepack pnpm check` runs source and type/build checks. GitHub Actions separately tests migrations with a disposable Postgres 16 service.

## Development fixture boundary

- No private testimony, real identities, case documents or FOIA data should be loaded into local seed fixtures.
- Local Mailpit is not a production email provider and receives only synthetic test messages.
- Real Render/Neon deployment and guaranteed workers require the owner-approved service and secret-store configuration. Any database-dependent public feature remains disabled until its own acceptance gate.
- The local Mailpit image tag is a **development-only convenience**, not a pinned production artifact; pin/verify digest as part of JFA-07 hardening.
