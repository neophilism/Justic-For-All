# Core Public API v1 (JFA-04)

Canonical source contract: [public-v1.json](../packages/contracts/openapi/public-v1.json), served from `GET /api/v1/openapi.json`.

## Implemented routes

- `GET /api/v1/initiatives`: explicitly public initiative summaries; API envelope contains `api_version: "1"`, a per-request opaque `request_id`, and a list of approved informational records.
- `GET /api/v1/initiatives/{slug}`: one public summary; invalid or missing slugs return a structured 404 without secret details.
- `GET /api/v1/articles?slug={slug}`: a current, approved public editorial revision with public attribution, review dates, media description placeholders and an explicit verification caveat. It returns 404 for non-public or withdrawn content and 503 if the editorial store or review evidence is unavailable. Responses use `no-store` until durable cache invalidation is wired.\n- `GET /api/v1/openapi.json`: static documented implemented contract.
- `GET /health`: process liveness only. Does **not** prove connected database, real public submissions, privacy safety or production deployment.
- `GET /ready`: returns 503 until a dedicated core database and migration readiness check are implemented. A 200 liveness endpoint does not override this explicit not-ready state.

Status fields are informational and start at `planning`. A future `available` designation must be validated against upstream service readiness, content authorization and reviewed CTA. An unavailable service must not be presented as a live filing or confidential submission tool.

## Privacy and compatibility

Public initiative responses serialize only `slug`, `name`, `description`, and `status`. The article response includes approved document text, public labels and dates, but no account IDs, draft/review workflow identifiers, or staff notes. Responses use structured errors and headers. There are **no** public POST, PATCH or DELETE routes in this first version. Future private workflows require scoped authentication, CSRF measures and actual dedicated services.

Clients must negotiate/document API version 1; future breaking changes use a new version prefix. OpenAPI currently covers the small shipped public surface and is structurally checked by unit tests; external reference-validator and browser contract tests are a JFA-07 enhancement, not a claim of external schema certification.
