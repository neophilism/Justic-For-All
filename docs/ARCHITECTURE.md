# Architecture and trust boundaries

See [full plan](DEVELOPMENT_PLAN.md), §§3–8.

The core owns: public shell, accessible navigation, editorial content, initiative registry, basic identity/contact preference, consent, module discovery, and integration contracts.

The core **does not own**: private testimony, evidence and cases (Injustice Project / Secure Intake); FOIA archives (FOIA Aggregator); FOIA request submission (The Public Record); distributed replicas (Liberty Nodes).

## Non-negotiable safeguards

1. No generic confidential testimony or identity-submission form is shipped as a substitute for dedicated verified secure intake.
2. No publishing content, contact data, case material or documents from downstream services without documented approval and filtering.
3. No service-to-service secret is sent to the browser or committed to Git.
4. Not all components are end-to-end encrypted. Follow the component- and flow-specific E2EESA applicability process; no unsubstantiated conformance claims.
5. Public route data is public; private administrative data requires independent server-side authorization.
6. Public replication requires explicit release approval; deletion/withdrawal from irreversible replicated copies cannot be guaranteed.

## Operational status

Repository bootstrap only. No Render/Neon service or production safety assurance is established by these files.

## Source layout after JFA-03

- `apps/web/app/`: only web runtime and public routes
- `apps/worker/`: disabled until its job contracts are reviewed
- `packages/contracts/`: versioned core DTOs and API representations
- `packages/core/`: initiative registry and pure policy logic
- `packages/ui/`: shared accessible presentation primitives
- `packages/adapters/`: disabled external adapters until verified
- `packages/security/`: classification helpers; not a cryptographic implementation

See [ADR-0002](ADR/0002-package-boundaries.md).
