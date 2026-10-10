# JFA-05 — Dedicated core Postgres data model

**Status:** The schema and migrations exist in source. There is **no** provisioned Neon database, user migration, working authentication, confidential intake, or real production deployment established by this PR.

## Contents

- [0001_core.sql](../db/migrations/0001_core.sql): canonical PostgreSQL 16 baseline with 21 core-owned tables, integrity checks, indexes, safe public views and append-only metadata triggers.
- [0001_core_down.sql](../db/migrations/0001_core_down.sql): destructive teardown **for disposable local/test databases only**; never a production rollback mechanism.
- [001_schema_assertions.sql](../db/tests/001_schema_assertions.sql): actual PostgreSQL test that rejects invalid status, disabled-module bypass, premature publication, and mutation of append-only consent.
- [0001_demo.sql](../db/seeds/0001_demo.sql): labeled synthetic demonstration initiative; not published.
- `packages/db/src/schema.ts`: strongly typed Drizzle mappings of *public-facing/core integration control* tables. Private entity type mappings and the runtime DB connection are intentionally deferred until authorization and data encryption boundaries are implemented.

## Data protection

- Contact addresses are stored only as ciphertext columns plus opaque key references; application encryption and key lifecycle have **not** been implemented and are not assumed secure.
- Consent, revision, approval and audit metadata are append-only. Do not put sensitive testimony or directly identifying narratives in these tables; immutable audit logs can conflict with privacy/erasure rights.
- Publication requires explicit approved date/state. Views expose only approved, allowlisted columns and exclude contact credentials and reports.
- Module connections default to disabled and cannot be enabled at DB level until a verified HTTPS base URL, reviewed contract, approval and verification time are recorded.
- Health is observation-based; `unknown`, `down` and `unverified` are distinct.
- One database per application, no direct cross-engine DB access.

## Operational execution

Disposable PG16 example:

```sh
psql -v ON_ERROR_STOP=1 -d jfa_test -f db/migrations/0001_core.sql
psql -v ON_ERROR_STOP=1 -d jfa_test -f db/migrations/0001_core.sql # replay should be safe
psql -v ON_ERROR_STOP=1 -d jfa_test -f db/seeds/0001_demo.sql
psql -v ON_ERROR_STOP=1 -d jfa_test -f db/tests/001_schema_assertions.sql
```

Production migrations must be applied from reviewed immutable releases with backup verification and out-of-band credentials; test expand/migrate/contract compatibility, confirm PostgreSQL version and free disk, and monitor schema drift. Never automatically run the destructive down script in production. JFA-06 adds typed config, local Postgres Compose, live readiness gating, and runtime migration orchestration. JFA-07 adds supply-chain and full lockfile gates.

## Explicit remaining work

A runtime DB client, private Drizzle mappings and authorizations, row-level policy/least privilege, operational backup/restore, and external Neon provisioning remain **unverified/not implemented**. Passing migration unit tests does not certify privacy compliance or E2EESA.
