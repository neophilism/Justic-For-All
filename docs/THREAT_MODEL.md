# JFA-08 — Threat model and risk register

Date: 2026-10-10. Status: baseline risk inventory, not a production security assessment.

## Assets and attackers

The site serves public educational material to anonymous visitors. Future assets include private editorial drafts, role grants, personal contact/consent records, service credentials, integrated public archives, cross-service event integrity and public release approvals. Core explicitly does **not** own private testimony or case evidence.

Attackers and failure modes include unauthorized requesters, bots, identity recovery attackers, abusive volunteers, staff/insider mistakes, compromised CI/supply chain or hosting providers, malicious upstream publishers, surveillance/traffic observers, and independent distributors retaining copies. Threat models include lawful compelled disclosure, provider metadata, compromised devices and accidental misclassification: no promise of absolute anonymity.

The trust boundaries are: browser↔public core; editor browser↔private staff API (not built); core↔dedicated Postgres; core↔email/auth providers (not built); core↔domain apps (not configured); reviewed public artifact↔untrusted Liberty Nodes (blocked); GitHub↔CI↔future hosted release.

## Active risk ledger

| Risk | Severity | Scenario | State |
|---|---|---|---|
| R01 | critical | Access to private profiles, contacts, draft content or case details through broken object- or field-level authorization | open |
| R02 | critical | Exfiltration, tampering, or disclosure of contact data and operational keys | open |
| R03 | high | Unapproved publication, audit deletion or quiet replacement of records | open |
| R04 | critical | Identification, intimidation or targeting of sources through traffic metadata, file EXIF, replicated content or provider access | open |
| R05 | high | Spoofed source, changed archive output, misleading status or cached withdrawn allegations | open |
| R06 | high | DoS, SSRF, dependency compromise, action credential theft and repository poisoning | open |
| R07 | critical | An allegedly approved private artifact is published or replicated without valid consent and redaction | open |
| R08 | high | Compromised accounts, unsolicited political contact, unauthorized marketing or enrollment of minors | open |

The machine-readable ledger in [security-boundaries.json](../config/security-boundaries.json) contains the actor, current mitigations, residual risks and required controls for each risk. All remain open until there is independently verified evidence. Public bootstrap health and a passing CI pipeline alone cannot close these risks.

## Defensive testing gates

- Ensure public initiative APIs return only four fields and cannot route to private source APIs.
- Validate invalid slugs, unconfigured DB, refused/delayed DB, malformed module config and requests with no approved publication.
- Assert no identity/contact/case notes are present in public projections, tracing or CI logs. Do not log sensitive payloads for testing.
- Model replay, webhook signature and service-credential rotation before enabling a service adapter; deny unsigned callbacks and private payloads.
- Run adversarial XSS/CSRF/idempotency/access-control tests once those APIs are implemented; no current passing tests are claimed for nonexistent routes.
- Verify release/workflow provenance and advisory status for exact commit SHA; no trust based merely on repository main.
- For protected flows, inventory recipients, key establishment, recovery/deletion limitations, metadata and exact E2EESA approved profile before claiming E2EE.

## Production block list

No production confidential intake, subscriber/volunteer contact collection, unpublished story release, independently republished sensitive material, service-to-service private data exchange, or global account login until dedicated source owners, validated architecture, tests, legal reviews and security assurance approve their respective flows. Nothing in this file enables those features.
