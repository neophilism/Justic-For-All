# ADR-0003: Fail-closed public core API contracts

- **Date:** 2026-10-10
- **Status:** Implemented in the initial public API version; formal external validator pending JFA-07.
- **Context:** Many downstream civic services are not yet verified. Public browsers require predictable safe summaries and versioned errors.
- **Decision:** Define API version 1 as a small implemented, OpenAPI-documented read-only surface. Only public initiative descriptions are returned. Do not implement pseudo-endpoints for secure intake, subscriptions, private accounts, FOIA filing or volunteer referral before their ownership and consent checks exist.
- **Controls:** Stable paths, explicit projection, bounded slugs, structured 404, opaque per-request IDs, no-store for errors and readiness, documented cache for published informational data.
- **Readiness:** `/health` is process-only; `/ready` returns 503 until database readiness actually exists.
- **Future gates:** JFA-05 schema, JFA-06 environment/readiness, JFA-07 OpenAPI validation, JFA-08 security analysis.
