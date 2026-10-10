# JFA-08 — E2EESA component and data-flow applicability inventory

**Source baseline:** [E2EESA commit `6ec85d51f9207da31f0e90fd8a7c82ffff8448f6`](https://github.com/neophilism/End-To-End-Everywhere-Security-Architecture-Standard/tree/6ec85d51f9207da31f0e90fd8a7c82ffff8448f6), observed **`0.9.0-rc.2-dev`** (under remediation). This matrix is an **applicability inventory**, not an assessment, profile selection, test pass or certification. Changes upstream must be reviewed before claiming a stable profile.

The authoritative machine-readable list is [security-boundaries.json](../config/security-boundaries.json) with **11 distinct flows**, plus the [threat ledger](THREAT_MODEL.md). User-facing claim: **No E2EESA production conformance or independent security certification currently exists**.

## Applicability / impact matrix

| Flow | Current state | Classification | E2EESA applicability | Recipient/key authority | Remaining evidence |
|---|---|---|---|---|---|
| F01 — Public HTML and static assets | `implemented` | `PUBLIC_APPROVED` | `not_applicable_documented` | TLS origin operator; not an E2EE recipient | Documented public/no-private-payload rationale |
| F02 — Initiative public API GET | `implemented` | `PUBLIC_APPROVED` | `not_applicable_documented` | TLS origin operator; no confidential recipient keys | Documented public/no-private-payload rationale |
| F03 — Process liveness and DB readiness | `implemented` | `INTERNAL_OPERATIONS` | `not_applicable_documented` | Server-managed database/TLS credentials if configured | Documented public/no-private-payload rationale |
| F04 — Core database: initiatives, public CMS and private metadata | `partially_implemented` | `PERSONAL_RESTRICTED` | `needs_component_assessment` | Database/operator for SQL access; app-level field keys not provisioned | Scope, keys, endpoint controls and independent assurance missing |
| F05 — Public CMS authoring, reviewer separation and publication | `planned` | `EDITORIAL_DRAFT` | `needs_component_assessment` | CMS service operator, draft reviewer and account provider TBD | Scope, keys, endpoint controls and independent assurance missing |
| F06 — Identity recovery and subscription contact preferences | `planned` | `PERSONAL_RESTRICTED` | `needs_component_assessment` | User/auth provider and application contact encryption keys TBD | Scope, keys, endpoint controls and independent assurance missing |
| F07 — Confidential testimony, evidence and case referral | `blocked` | `HIGH_RISK_CONFIDENTIAL` | `blocked_until_independent_evidence` | Specialized intake recipients and verification authority not approved | Scope, keys, endpoint controls and independent assurance missing |
| F08 — Cross-service signed event delivery | `planned` | `INTERNAL_OPERATIONS` | `needs_component_assessment` | Versioned service signing keys (not created) | Scope, keys, endpoint controls and independent assurance missing |
| F09 — FOIA/public-registry approved read-only projections | `planned` | `PUBLIC_APPROVED` | `not_applicable_documented` | Public source provenance/signature authority to verify | Documented public/no-private-payload rationale |
| F10 — Liberty Nodes public replica publication | `blocked` | `PUBLIC_REPLICATED` | `blocked_until_distribution_review` | Public artifact signer TBD; replicas retain copies independently | Documented public/no-private-payload rationale |
| F11 — Development GitHub and artifact supply chain | `implemented` | `INTERNAL_OPERATIONS` | `not_applicable_documented` | GitHub Actions service identities; release signing not implemented | Documented public/no-private-payload rationale |

## Policy and interpretation

1. **Assess flows, not repository labels.** A public Next application can have private contact or editorial data flows. Deployment to an HTTPS host or database encryption does not produce end-to-end confidentiality or remove metadata exposure.
2. **Distinguish "not applicable" from "certified".** An inapplicable private-content profile requires a documented rationale, while authentication, supply-chain, integrity and privacy controls may still be applicable under their respective families.
3. **Recipient authority:** A server controlled by the operator that holds decryption keys is *not* an end-to-end-only recipient promise. Public records have no private recipient authority, but provenance and authorized publication remain essential.
4. **Sensitive source protection:** F07 remains *blocked* until an independently reviewed dedicated intake application is ready, including anonymity limits, recipient/key policy, clear consent, privileged logging exclusions and legal/safety review.
5. **Public replication:** F10 remains *blocked* until separate publication/replication consent and explicit disclosure that third-party replicas may survive retraction. Default no replication of personal stories.
6. **Exfiltration/metadata:** TLS, E2EE and content-addressing do not eliminate request IP/timing, provider logs, browser compromise or device-level threats. Do not promise total anonymity or deletability.
7. **Versioned profiles:** No selected recommended/allowed profile family is asserted for protected flows. Never silently choose experimental/provisional profiles, or classify an unimplemented feature as production verified. Any future profile requires exact standard version/catalog digest, claim scope, key path and evidence.
8. **Response to uncertain evidence:** On failed/stale inputs, classify as `unassessed` or `blocked`. A missing report is not a passing report.
9. **No sensitive content in append-only history:** Keep only minimal metadata in audit tables and removable, separately protected payload storage for consent/retraction workflows.
10. **Change control:** Every new browser/server, worker/provider, email, database, upload, logging or replica data flow requires a specific threat-ledger entry, classification, recipient authority and security assessment before deployment.

## Release gate and evidence state

- JFA-08 pass means the inventory and negative-path tests are checked in and reviewed. **It does not itself close any production security gate**.
- Evidence items **not present**: per-profile E2EESA evaluator input bundle, authenticated transport and key-path examination, authorized device key-recovery policy, external penetration-test report, production credential/scanner/probe evidence, minors/retention legal sign-off.
- Private contact, sensitive testimony and distributed replication remain disabled until their separate release and legal/safety gates.
