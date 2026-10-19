# JFA-14 editorial publication workflow

The mapped draft PR contains an internal database service, not an authenticated HTTP authoring route. Callers must derive actor identity from a trusted staff session. The service rechecks active core roles in PostgreSQL for each operation.

A draft author submits an immutable draft version to review. All items require two distinct reviewers who are neither the author nor each other. A reviewer or administrator records each approval. An editor or administrator can publish only after the second approval; the author cannot publish their own work. The transaction checks the exact draft version, inserts a new immutable published revision, moves the public pointer, writes an audit event and enqueues a public-only change event. A concurrent edit makes the review stale and requires a new submission.

An administrator can withdraw only the workflow's currently published revision. Withdrawal creates another immutable revision, changes visibility to withdrawn and enqueues a tombstone event in the same transaction. The existing public view then excludes it. A correction requires a new draft and a fresh two-person review. Restoring old content also requires a new reviewed revision rather than mutating history.

The private preview reader returns a validated structured document for an authenticated editor, reviewer or administrator. It does not expose a public preview URL or load remote media. Cache consumers must process the outbox event and invalidate matching slug/locale entries; no cache consumer is connected yet.

The `0003_editorial_workflows.sql` migration adds the workflow table and a database guard preventing a published revision without two independent approvals. The migration runner discovers numbered migrations in order. The protected GitHub Actions database workflow currently applies only the baseline migration, so `db/tests/004_editorial_publication.sql` has not run in CI. The public `verify` job runs the pure state-transition tests and typechecks the service. Live PostgreSQL authorization, concurrent review, outbox delivery and cache invalidation still require integration tests and a configured staff identity boundary.
