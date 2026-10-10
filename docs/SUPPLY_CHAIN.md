# JFA-07 — Release and software supply-chain gates

Security release posture: **development, not certified**. The project must not deploy restricted user workflows until JFA-08 and independent review.

## Current controls

- Pinned Node and pnpm; pnpm workspace lockfile generated on CI, reviewed and committed; CI now requires frozen installs.
- Read-only GitHub Actions token permissions; first-party Actions pinned to observed immutable source SHAs; no deploy secrets in pull-request workflows.
- ESLint via TypeScript parser and plugin (avoids deprecated Next ESLint configuration dependency chain) and tests/build.
- Security upgrade in this review: Next.js 15.5.24, patched PostCSS and Sharp resolutions. Review actual pnpm lockfile resolution and audit output before acceptance; do not assume requested overrides resolved optional dependencies.
- Tracked-file static secret heuristics (private-key headers, GitHub token-like strings, Neon credential patterns, AWS access-key IDs). False negatives are possible; secrets must still be stored only in a provider secret manager and independently reviewed.
- Dependabot proposals require passing checks and review.
- Every PR executes a dependency advisory check at the high-severity threshold and generates a license inventory for review. Vulnerability remediation or documented waiver must precede merge.
- Postgres 16 migration replay and negative assertions are separate CI jobs.

## Additional controls required before production approval

- Periodically review and regenerate `pnpm-lock.yaml` in a dedicated PR using the pinned toolchain and run `pnpm install --frozen-lockfile` in CI.
- Dependency advisory assessment including relevant reachable risks, accepted exceptions, license summary and remediation dates. Do not assume the upstream repositories' lack of SPDX license permits copying their source.
- SBOM (CycloneDX or SPDX), release provenance, signing, artifact retention and verifiable build/release identity.
- Browser accessibility tests, hostile upload/XSS/CSRF and service-to-service auth tests for any private functionality.
- Production branch protection and mandatory checks should be configured in GitHub settings by an authorized admin. Document the exact required status names.

## Constraints

This repository is a public static scaffold, not a secure evidence repository. Do not enable general-purpose private forms or real communications until owner-approved security gates pass.
