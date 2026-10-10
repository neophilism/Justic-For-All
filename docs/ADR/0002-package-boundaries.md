# ADR-0002: pnpm TypeScript workspace and a single web runtime

- **Date:** 2026-10-10
- **Status:** Accepted for implementation foundation.
- **Choice:** Node.js 22.16.0; pinned pnpm 10.18.3; one Next.js 15.5.24 App Router app in `apps/web`; isolated disabled `apps/worker`; reusable `@jfa/contracts`, `@jfa/core`, `@jfa/ui`, `@jfa/adapters`, `@jfa/security` packages.
- **Trust boundaries:** Browser imports only expressly public approved models. Worker code cannot automatically run inside Next.js request handling. External service adapters remain disabled pending JFA-02 runtime gates.
- **Dependency quality:** During JFA-07 the lockfile is regenerated and frozen after advisory remediation. CI must pass audited advisories before merge.
- **Forward migration:** Move only package-owned code under its package; no duplicate root `app/` implementation. Expand shared packages only for truly reusable code.
