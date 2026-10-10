# JFA-02 — Source-pinned dependency and integration census

Checked **2026-10-10** against the GitHub repositories and README, package versions, architecture/contract documents. The machine-readable evidence is in [config/dependency-census.json](../config/dependency-census.json). The source SHA is an **observed code revision**, not an approved production release or audited conformance verdict. None of the six upstream repositories currently reports an SPDX license through GitHub metadata; reuse must be reviewed before copying source code.

| Upstream source | Observed version | Intended relationship | Existing contract evidence | Production state |
|---|---|---|---|---|
| [E2EESA](https://github.com/neophilism/End-To-End-Everywhere-Security-Architecture-Standard) | 0.9.0-rc.2-dev | Component/flow-level normative reference | `spec/conformance-engine.md`, audit remediation | Non-production development standard; certification not assumed |
| [Secure Intake](https://github.com/neophilism/Secure-Intake-Case-Workflow-Engine) | 1.0.0-rc.9 | Authorized private case API only, owned outside this app | `/api/v1/openapi`, `/api/ready`, API client scope docs | Not probed; endpoint/base URL unconfigured |
| [Civic Registry](https://github.com/neophilism/Civic-Registry-Transparency-Engine) | 0.0.0 (root) | Publicly approved registry projection | `/api/v1/openapi.json`, public API package | Public feed not verified |
| [Compliance Audit](https://github.com/neophilism/Compliance-Authorization-Immutable-Audit-Engine) | 0.1.0 | Optional privileged audit service | SDK evidence/reporting; `/health` | Service not probed |
| [FOIA Aggregator](https://github.com/neophilism/FOIA_Aggregator) | No release version verified | Read-only approved public FOIA search metadata | FastAPI architecture, `/healthz` | Live dataset and access policy not verified |
| [Engine Room](https://github.com/neophilism/Engine-Room) | 1.0.0-rc.1 | Development portfolio reporting only | `/api/health`, `/api/ready`, public GitHub status, .exechub manifest | Production observation / dashboard sync unverified here |

## Contract and permission gates

1. The website is public-by-default for *approved* editorial projections only; never forward bearer credentials or private case data to browsers.
2. Every runtime adapter is **disabled** until the exact service base URL, TLS, outbound auth scope, OpenAPI version, response schema, release SHA and data classification have been verified in the authorized environment.
3. Only use an upstream service's supported API or SDK with a documented stable version; do not query its databases directly or copy upstream implementation code under unresolved licensing.
4. Each connection must implement timeout, retry budget, per-route allowlist, authorization, response schema, redaction, provenance, cache and offline display behavior. Never invent a health or index endpoint.
5. For secure intake, a success on `/api/health` is only liveness; database readiness is `/api/ready`. The core must not pretend case services work until a tenant-scoped credential and private user consent are verified.
6. E2EESA's development tree is under audit remediation; no project-wide E2EESA certification claim. Record each component/flow's applicability, profile/version and independent evidence.
7. An empty repo, absent API or no credentials is a **blocked dependency**, not a 0%-functional production module. The public initiative directory may display honest planning status.

## Provisioning and cost boundary

Use a new dedicated Neon DB and Render service only once the owner has provided an authorized project/workspace and an approved cost posture. Do not silently reuse credentials/databases from an unrelated platform. Never commit secrets. The current repository has only a public static scaffold.

## Handoff evidence and follow-ups

- Upstream source identities and hashes: machine-readable JSON; update on every reviewed integration change.
- Exact contract paths: source verified; runtime responses, authorization and base URLs: **not verified**.
- License review: **blocked** pending explicit licensing decisions or independent legal permission.
- Next JFA-04 milestone will define stable OpenAPI contracts for core's own interfaces and adapter failure envelopes, not reproduce upstream API internals.
