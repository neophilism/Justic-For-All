# JFA core — Data classification and handling boundaries

This is a design/acceptance baseline, not a claim of current compliance or a retained-data policy decision.

| Classification | Examples | Default treatment |
|---|---|---|
| `PUBLIC_APPROVED` | Editorially reviewed informational page, verified initiative summary, approved public FOIA metadata | Public caching allowed only with provenance, TTL and withdrawal invalidation |
| `EDITORIAL_DRAFT` | Staff drafts, review notes, proposed public writing | Deny public access; role-scoped processing, audited publication transitions |
| `INTERNAL_OPERATIONS` | Source sync observations, integration configuration identifiers, audit metadata | Staff/service-only as relevant, scrub secrets in logs, restricted retention |
| `PERSONAL_RESTRICTED` | Email address ciphertext, consent/volunteer preferences, recovery data | Purpose-specific permissions, encrypted storage with independent key management, erasure capability |
| `HIGH_RISK_CONFIDENTIAL` | Unpublished source identities, sensitive testimony and raw evidence | Not collected by core; specialized intake with independent controls and explicit authorization |
| `PUBLIC_REPLICATED` | Separately approved public artifacts published to independent replica networks | Formal publication consent and permanence/withdrawal disclosure; default opt-out for personal stories |

Data handling requirements: collect minimally, never infer privacy or anonymity from pseudonyms alone, encrypt private data under documented recipient/key authority, exclude raw personal content from immutable audit/outbox, enforce review/redaction before public release, and do not export to third parties or replicas automatically. Legal hold and backup retention are separate controls; a withdrawal request does not guarantee removal from outside copies.

Review all new routes/providers/telemetry flows against [SECURITY_E2EESA_MATRIX.md](SECURITY_E2EESA_MATRIX.md) before release. Retention periods and exact external provider contracts require separately approved decisions.
