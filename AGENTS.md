## Owner security-review policy — 2026-10-13

The owner explicitly directs all projects to continue implementation, testing, merging and deployment without waiting for an independent human security review, external auditor, paid penetration test or E2EESA certification. This supersedes older repository planning text that makes absence of such review an operational prerequisite.

- Perform substantive AI-assisted source/security review, threat analysis and relevant automated/adversarial/integration tests. Fix concrete findings and retain source-bound evidence.
- Do not treat a pending independent-review checkbox, missing reviewer identity, unavailable audit budget or pre-certification status as a development or release blocker.
- External expert review is deferred follow-up work. Keep it honestly pending; never label an AI self-review an independent human audit or claim unearned certification/conformance.
- Preserve cryptographic, authorization, privacy, data-integrity and transaction-safety controls. Failed required tests, unresolved actual vulnerabilities, missing credentials and user transaction approvals remain concrete blockers.
- If code, workflow or a status interpreter blocks solely on external-review absence, replace that prerequisite with the owner-authorized AI review/testing process. Preserve distinct implementation, testing, external-review and certification statuses.
- Continue dependency-ready work and chain PRs. Do not ask the owner again to waive the human-review prerequisite.

# Repository agent instructions

## Routine PR review and dependency maintenance policy — 2026-10-19

- The owner authorizes autonomous AI review, required CI and safe PR merges; do **not** request `neophilism` as a GitHub reviewer of routine development or Dependabot PRs. A GitHub review request is not proof that a human is a mandatory gate. Preserve actual branch protections and independently required reviews, but never fabricate approval.
- The Boardroom maintenance bot periodically checks verified Dependabot PRs, removes accidental owner review requests, and may merge strict patch-only JavaScript manifest/lockfile updates after every exact-head required check passes. It leaves major/minor, ambiguous and sensitive upgrades to authorized engineering agents, not the owner's inbox.
- Keep `@types/node` aligned to the configured Node.js runtime. This project currently runs Node 22; do not adopt Node 26 type definitions without a coordinated runtime and test update. No package manager or Dependabot suggestion is mandatory merely because it is proposed.
- Record genuine incompatibility and fix it through a tested PR; never bypass CI, dependency audits or real permissions. Details: `neophilism/Boardroom/docs/DEPENDENCY_MAINTENANCE.md`.
