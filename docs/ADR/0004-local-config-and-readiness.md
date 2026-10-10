# ADR-0004: Local fixture runtime and database-backed readiness

Date: 2026-10-10. Status: implemented development path; no hosted database authorized by this change.

- Local PostgreSQL 16 and Mailpit run via Docker Compose with loopback-only bound ports.
- Postgres URLs are parsed strictly; production DB URLs must use a supported TLS `sslmode`. Validation never logs the credential-bearing URL.
- A process-alive response (`/health`) is not database readiness. `/ready` returns 200 only after the expected migration exists; absent/malformed DB URLs and stale/unavailable schema return coarse 503 errors.
- Connections remain server-side. No private case workflow, key store, identity service or worker has been enabled.
- Migration runner uses reviewed 0001 baseline SQL and has no destructive down-step. Production change control, backup/restore and least-privilege DB roles remain future gates.
