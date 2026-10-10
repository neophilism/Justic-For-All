# JFA-07 — Release and software supply-chain gates

Security release posture: **development, not certified**. The project must not deploy restricted user workflows until JFA-08 and independent review.

## Current controls

- Pinned Node and pnpm; pnpm workspace lockfile will be generated on CI, reviewed and committed before switching to frozen installs.
- Read-only GitHub Actions token permissions; first-party Actions pinned to observed immutable source SHAs; no deploy secrets in pull-request workflows.
- ESLint/TypeScript and tests/build.
- Tracked-file static secret heuristics (private-key headers, GitHub token-like strings, Neon credential patterns, AWS access-key IDs). False negatives are possible; secrets must still be stored only in a provider secret manager and independently reviewed.
- Dependabot proposals require passing checks and review.
- Postgres 16 migration replay and negative assertions are separate CI jobs.

## Additional controls required before production approval

- Generate and commit a deterministic, reviewed `pnpm-lock.yaml`; run `pnpm install --frozen-lockfile` in CI.
- Dependency advisory assessment including relevant reachable risks, accepted exceptions, license summary and remediation dates. Do not assume the upstream repositories' lack of SPDX license permits copying their source.
- SBOM (CycloneDX or SPDX), release provenance, signing, artifact retention and verifiable build/release identity.
- Browser accessibility tests, hostile upload/XSS/CSRF and service-to-service auth tests for any private functionality.
- Production branch protection and mandatory checks should be configured in GitHub settings by an authorized admin. Document the exact required status names.

## Constraints

This repository is a public static scaffold, not a secure evidence repository. Do not enable general-purpose private forms or real communications until owner-approved security gates pass.
