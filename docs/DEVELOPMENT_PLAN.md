# JUSTICE FOR ALL — CORE PLATFORM
## Complete development and independent-agent handoff plan

**Plan ID:** JFA-CORE-2026-10-10  
**Version:** 1.0 planning baseline  
**Prepared:** October 10, 2026  
**Status:** The owner-designated GitHub repository has been initialized for development; implementation, Render service, Neon database, production domain and live deployment are not thereby verified. The 50 milestones below are proposed work-package IDs, **not** actual GitHub PR numbers or statements of completed work.  
**Authorized repository:** `neophilism/Justic-For-All` (owner-provided existing repository; slug intentionally preserved).  
**Target:** An independent ChatGPT account, developer or agent must be able to implement this platform using this document and the linked source repositories, without access to preceding conversations.

---

## 1. Executive mandate and non-negotiable project boundaries

**Justice For All** is the umbrella civic movement/platform, which may have an affiliation with the Justice Party but must not be structurally dependent on it. Its online mission is to help people tell documented stories of injustice, find appropriate assistance, obtain and share public records, organize voluntary nonviolent civic actions, and make official accountability easier for the public to evaluate.

The **Core Platform** is the shared web, identity, editorial, navigation, governance, integration and operational foundation. It **is not** the entire functionality of every initiative and **is not** a catch-all replacement for reusable upstream engines.

### Decisions carried forward from earlier discussions

1. The central participation pathway is personal testimony, including audio/video and optional pseudonymity or anonymity, paired with offers of help. The dedicated **The Injustice Project / Injustice Archive** application will own sensitive testimony and evidence workflows; the core hosts an accessible entry point and approved public projections.
2. Participants and witnesses may find lawyers, researchers, journalists, artists, advocates and other helpers, but no private contact or identity is exposed without the affected person's permission.
3. New participation options may roll out over time. A module can appear as a clearly labeled information page before its functional application is ready; **never** display inactive controls as operational.
4. **The Public Record** is the mass FOIA participation program; **FOIA Aggregator** is the pre-existing records-ingestion/search infrastructure. They are different products.
5. **Liberty Nodes** serves technically inclined volunteers; ordinary participants must not need IPFS, cryptocurrency, keys or technical tools.
6. The movement's proposed programs also include **Justice Teams**, **Witness Corps**, **One Question**, **Justice Works**, **Public Witness**, **Human Firewall / Consent Strike**, and **Surveillance-Enabler Boycott**. Their domain behavior belongs in separate development plans. The core supports their registration, discovery and integration.
7. Use the **End-To-End-Everywhere Security Architecture Standard (E2EESA)** for component- and data-flow-specific requirements. Do not claim blanket compliance, E2EE, anonymity, audit certification or production security without evidence; its present standard is undergoing audit remediation.
8. Integrate with **Engine Room** for actual GitHub/CI/deployment/status monitoring; never manufacture progress, activity, participation or availability figures.
9. Build in PR-sized, independently testable increments; automatically continue through approved, passing, low-risk PRs where permissions and tooling allow. Pause for genuinely material product/legal/security decisions, actual failing tests, unavailable secrets, conflicts or external provisioning.

### Explicit out of scope for the core repository

- Recording, redacting, storing or case-managing confidential testimony/evidence (owned by the Injustice Project + Secure Intake engine).
- Sending FOIA requests or controlling agency logins (owned by the Public Record application).
- Crawling/archiving federal records (owned by FOIA Aggregator).
- Implementing distributed replication or permanence (owned by Liberty Nodes).
- Full case assignment, evidentiary assessment or legal assistance (owned by Justice Teams + Secure Intake engine).
- Full incident observer workflow, issue/debate exchanges, boycott research, mass event coordination or the future Unified Dashboard (each has its own planned app/module).
- Fundraising, paid membership, candidate election operations, political-ad targeting, facial recognition, identity verification of ordinary participants, intrusive analytics, or algorithmic political persuasion. Add only under a separately approved product/legal plan.
- State or federal policy plans such as **The Garden** and **The Cornerstone** are separate policy programs. The core can link to their public materials but must not reinterpret them as civil-disobedience software features.

**Architecture axiom:** Keep the umbrella small and trustworthy. Write reusable functionality in existing engines if truly domain-neutral; configure/consume it downstream. Do not fork the engines or share their private database tables.

---

## 2. Audience, journeys and user experience

### Primary audience / personas

| Audience | Need | Core behavior |
|---|---|---|
| Unregistered visitor | Understand movement and initiatives | Fast public site, clear information, no login wall |
| Person seeking to tell a story | Understand choices and risks | Guided path to dedicated secure intake; confidentiality and publication options clearly explained |
| Public/pseudonymous contributor | Control public presence | Account optional where feasible; explicit, versioned permissions |
| Volunteer/helper | Offer skills | Consent-based interest/contact flow; detailed matching in Justice Teams |
| Journalist/researcher | Find verified source material | Links to approved public records with provenance and attribution labels |
| Civil-action participant | Find responsible public information | Public campaign descriptions, accessibility, safety and jurisdiction-specific information, where available |
| Content editor | Publish accurate information | Versioned draft/review/approval/publish workflow |
| Moderator/safety reviewer | Address harmful content | Role-limited safety console, reports and documented appeal/correction process |
| Platform administrator | Operate site safely | Secure privileged accounts, health, integrations, backup evidence and audit trail |
| Partner initiative service | Register an integration | Signed, scoped, versioned machine-to-machine contracts |

### Required public journeys

- **First-time arrival:** In no more than two navigational steps, find (a) the mission, (b) tell a story, (c) get involved, (d) explore initiatives, (e) public records and (f) public contact/privacy information.
- **Storyteller:** Before disclosing private information, see the plain-language differences among public, pseudonymous, identity-obscured and restricted submission modes; be handed off to a functioning secure intake service. The core must not pretend that a generic contact form has these protections.
- **Volunteer:** Choose how to help (legal, research, investigative, journalism, translation, accessibility, arts, logistics, technical); optionally provide contact details in a purpose-specific private form; accept an explicit contact preference and receive a confirmation without exposing their information publicly.
- **Researcher:** Browse initiative pages and documents, navigate to public archive/FOIA search, see source/provider and timestamp, and understand that personal allegations are not automatically independently verified.
- **Editor:** Draft -> review -> approve -> publish; edit produces a retained revision, not silent replacement. An authorized user can unpublish a piece and explain why without disclosing confidential reports.
- **Privacy requester:** Find an accessible mechanism to request an export, correction, withdrawal or deletion of data under the site's control, subject to legal holds and the limits of prior public dissemination.
- **Mobile/assistive user:** Complete all core public and account workflows by keyboard, screen reader and low-bandwidth mobile connection.

### Content design and language

Use clear, respectful, non-patronizing prose. Distinguish **a person's first-person account** from **independently corroborated claims**, **public records** and **editorial conclusions**. Never present allegations as proven merely because they are published. Use dates and jurisdiction when material. Include accessible caption/transcript links for media surfaced from other modules. The movement should be recognizable without a party membership or donation requirement.

---

## 3. Feature specification / exact product surface

### 3.1 Information architecture

Suggested public routes (all route names are proposed and should be recorded in an ADR when implemented):

```
/
/about
/principles
/get-involved
/initiatives
/initiatives/injustice-project
/initiatives/public-record
/initiatives/liberty-nodes
/initiatives/justice-teams
/initiatives/witness-corps
/initiatives/one-question
/initiatives/justice-works
/initiatives/public-witness
/initiatives/human-firewall
/initiatives/surveillance-enabler-boycott
/stories                     # only approved PUBLIC stories from downstream source
/records                     # public FOIA discovery gateway
/resources
/news                       # editorial updates; only when staffed
/contact
/privacy
/terms
/community-guidelines
/accessibility
/security
/account                   # authenticated self-service
/account/notifications
/account/privacy
/admin                     # role protected
/api/v1/...
/health
/ready
```

Universal primary navigation: **Home • Stories • Public Records • Initiatives • Get Involved • About**; accessible global menu, site search, footer links to safety/privacy and contact. The homepage has direct, differentiated calls to action (Tell Your Story; Offer Help; Explore Public Records) only when the target is implemented; otherwise offer honest explanatory/interest pages. No display of fabricated testimonies or statistics.

### 3.2 Core modules

**A. CMS/editorial.** Structured page types (standard page, initiative, article/update, resource, FAQ, site notice), previews, scheduled publication *only with a verified worker*, version history, media attribution, alt text, approval and rollback. One common content source; do not require code deployment to edit ordinary pages. No HTML injection or arbitrary embedded scripts.

**B. Initiative registry.** One versioned manifest per initiative: stable slug, full name, summary, overview, eligibility/participation note, safety note, internal owner, public URLs, external service source, operational status, approved calls to action, integration capability flags, logo/image rights, last verified timestamp. Status: `concept`, `planning`, `building`, `pilot`, `live`, `paused`, `retired`. `live` is only accepted after independent external health/capability verification. Separate internal development progress from public initiative availability.

**C. Public search.** Index only explicitly public, approved CMS records and safe search projections from integrated modules. Search result must contain title, type, summary, original source link, evidence label and freshness. Never index names/contact details or sealed material from private engines. No search content may be inferred from admin-only datasets.

**D. Identity and participation.** Public reading without accounts. Registration only for interactive core functions that require it; passkeys and/or verified email-based login with phishing-resistant MFA for privileged roles. Support pseudonymous display names. A pseudonymous account is **not** an anonymous intake channel. Separate consent for subscriptions, volunteer contact, public display and sensitive content publication. Offer unsubscribe and account deletion request.

**E. Updates and notifications.** Opt-in email news and participation notifications through provider abstraction; confirmed subscription, unsubscribe, suppression, retry and bounce handling; avoid sensitive details in email subject or body. No imported or purchased mailing lists. Public notices via RSS/Atom optional later; maintain a verifiable site updates feed if present.

**F. Editorial and safety moderation.** Site feedback, abuse reporting, publication review, conflict disclosures, attribution/correction workflow, appeals, takedown and incident escalation. Investigate reports without giving reporters access to nonpublic materials. Protect children, witnesses and third parties against doxxing or exposure.

**G. Shared access and integration.** Service directory, adapter SDK, machine-to-machine authentication, event contracts, health checks, and per-module feature flags. Central portal never directly reads another service's tables or private object storage.

**H. Admin workspace.** Content queues, role administration, consent/security notices, integration verification, privacy requests, publishing audit history, availability and queue failures. Segregate moderation, legal review and infrastructure administration.

### 3.3 Explicit public safety and participation requirements

A civil-disobedience information page may describe peaceful voluntary activity and relevant rules, but the platform must not promise legal protection, endorse harassment/threats, publish evasion instructions, encourage doxxing, or fabricate event permits. For events, provide prominent distinctions among organizer-submitted details, verified details, permits/attestations, potential arrests, accessibility and participant choices. Geographic legal guidance must be attributed, dated and reviewed rather than generated as an unqualified legal conclusion.

No crowdsourced reports identifying private persons should become publicly searchable without safety review and consent/legitimate publication grounds. The core must support moderation and retraction even when a downstream module owns the underlying content.

---

## 4. Architecture and technology stack

### Proposed concrete stack

| Layer | Choice / rationale |
|---|---|
| Language/runtime | Strict TypeScript on supported Node.js LTS; pin versions in the repo |
| Web | Next.js App Router/React; SSR or static caching for most public pages; progressive enhancement |
| API | Next.js route handlers for core endpoints; typed OpenAPI v1 contract; separate worker package as necessary |
| Database | PostgreSQL on a **new, dedicated Neon project**; one schema owned by the core; Drizzle ORM and audited SQL migrations |
| Auth | Audited, maintained passkey/email-login-capable identity library/provider; build a boundary adapter; document exact selection before JFA-19. Never invent crypto |
| Files | Small public CMS assets via private S3-compatible bucket (e.g., separate Backblaze B2 bucket) with public approved derivatives; never share FOIA Aggregator credentials/bucket |
| Email | Transactional-provider adapter; development uses local mail catcher; production mail blocked until provider/domain configuration verified |
| Jobs | Durable PostgreSQL outbox + worker with idempotency; no Redis prerequisite; actual scheduler/always-on worker required for guaranteed cron |
| Search | PostgreSQL full text for CMS; federated read-only adapters for domain-specific archives; no replication of private source documents |
| UI | Component system, semantic HTML, CSS tokens, keyboard-first accessibility |
| Hosting | New Render web service; optional independently scaled Render worker; Neon Postgres; distinct staging and production environments |
| Observability | Structured logs, error/trace IDs, server metrics, uptime probes, bounded alert routing; no sensitive payloads in logs |
| CI/CD | GitHub Actions for lint/typecheck/tests/build/secret scan/dependency scan and release checks; automated Render deploy after gated merge |

The stack is a documented implementation proposal, **not** a claim of provisioned infrastructure. Use current supported library versions when coding and pin them with lockfiles. Reuse existing engine APIs if versioned and verified, not unpublished internals. Obtain explicit authorization before incurring any paid infrastructure cost; free-tier sleeping services must not be represented as reliable schedulers.

### Deployment and trust boundaries

```
                        PUBLIC INTERNET
                              |
                 HTTPS / edge abuse protection
                              |
                   Justice For All Web
                 public routes + core API
                   /      |       \
             Public CMS  Auth/Consent  Module Registry
                   \      |       /
                      Core PostgreSQL
                           |
                   Durable Outbox / Worker
                           |
                 Signed service-to-service API
                    /       |        \
          Secure Intake  Public FOIA   Public Registry
            & Cases       Aggregator   + Audit Engine
                    \       |       /
                Approved public projections
                           |
              Liberty Nodes [separate release gate]
```

- The main web tier may SSR/cache **public** projections; only dedicated authorized backends should handle private evidence and confidential case workflows.
- Downstream engines remain independent products with their own API authorization, data storage, version lifecycle and administrators.
- Separate trust boundaries for editorial staff, infrastructure administrators, private case reviewers and public volunteers.
- Communication gateways validate server credentials and signatures; never expose server API keys or internal service credentials to browsers.
- Public replicated artifacts require an irreversible-distribution disclosure/approval gate. The core never auto-replicates sensitive records.

### Suggested repository shape

```
Justic-For-All/
  README.md
  LICENSE-DECISION.md
  .github/workflows/
  .exechub/                # only after exact schema and approval verified
  apps/web/               # public + account + editorial web
  apps/worker/            # outbox, health reconciliation, verified schedules
  packages/ui/            # shared accessible components
  packages/core/          # typed core domain and policy logic
  packages/contracts/     # API/events JSON Schema, OpenAPI, SDK types
  packages/adapters/      # service-specific adapters; no DB access to others
  packages/security/      # policies, tests, E2EESA applicability evidence
  db/migrations/
  db/seeds/
  docs/DEVELOPMENT_PLAN.md
  docs/ARCHITECTURE.md
  docs/ADR/
  docs/DATA_CLASSIFICATION.md
  docs/THREAT_MODEL.md
  docs/SECURITY_E2EESA_MATRIX.md
  docs/INTEGRATIONS.md
  docs/CONTENT_POLICY.md
  docs/PRIVACY_RETENTION.md
  docs/MODERATION_RUNBOOK.md
  docs/INCIDENT_RESPONSE.md
  docs/DEPLOYMENT.md
  docs/OPERATIONS.md
  docs/TEST_PLAN.md
  docs/ACCEPTANCE_EVIDENCE.md
  docs/HANDOFF.md
  docs/ROADMAP.md
  tests/unit/
  tests/integration/
  tests/e2e/
  tests/security/
  .env.example
  docker-compose.yml       # local Postgres/mail tools only
  package.json
  pnpm-lock.yaml
```

### Data stewardship / schema owner rule

There must be one authoritative writer per data class. Core owns site/editorial records, its user identity and optional contact preferences, initiative manifests, consent ledger, integration registrations, aggregate status evidence, and administration logs. Injustice Archive owns testimony/evidence/private safety flags, Secure Intake owns case metadata and the private support relationship, FOIA Aggregator owns archived record binaries/crawl provenance, and Liberty Nodes owns replication manifests. Domain apps grant the core purpose-scoped public projections and/or limited delegated operations.

---
## 5. Canonical data model and lifecycle contracts

Use UUID/ULID opaque identifiers, UTC timestamps, explicit provenance, optimistic locking, immutable version pointers and purpose-specific separation of public/private fields. Proposed entities follow; final physical names belong in migration ADRs.

| Core entity | Key fields | Invariants / confidentiality |
|---|---|---|
| `identities` | `id`, `account_state`, `created_at`, `disabled_at` | No political preference or legal identity proof required; internal immutable ID never equals email |
| `authenticators` | `id`, `identity_id`, `method`, `credential_ref`, `last_used_at`, `revoked_at` | Only provider-safe references and credential public data; no raw secrets |
| `profiles` | `identity_id`, `public_display_name`, `visibility`, `locale`, `accessibility_prefs` | Pseudonym defaults to private until deliberate publication; avoid handle enumeration |
| `contact_points` | `identity_id`, `purpose`, encrypted `address`, `verified_at`, `retention_state` | Per-purpose use, minimum access; never sent to analytics |
| `role_grants` | `subject_id`, `role`, `resource_scope`, `approved_by`, `expires_at` | Deny by default, expiry and reviewer separation |
| `initiatives` | `id`, `slug`, `display_name`, `status`, `public_description`, `service_ref`, `capabilities`, `reviewed_at` | Controlled registry, status backed by evidence, versions auditable |
| `cms_entries` | `id`, `type`, `slug`, `locale`, `current_revision`, `visibility` | Only approved revisions become public |
| `cms_revisions` | `entry_id`, `version`, `content`, `author`, `editorial_state`, `hash` | Immutable revision history, protected draft content |
| `publication_approvals` | `content_id`, `revision`, `approver`, `decision`, `reason`, `time` | No self-approval where separation of duties required |
| `consent_records` | `subject_ref`, `purpose`, `scope`, `policy_version`, `decision`, `time`, `withdrawn_at` | Append-only purpose changes, privacy-safe payloads; no blanket consent |
| `interest_offers` | `id`, `subject_ref`, `skill_categories`, `availability`, `contact_policy`, `status` | Encrypted personal details; never publicly list without additional approval |
| `subscriptions` | `id`, `contact_ref`, `topic`, `confirmation_state`, `unsubscribed_at` | Double opt-in for mass notifications; provider suppression honored |
| `privacy_requests` | `id`, `subject_ref`, `request_type`, `due_at`, `assigned_role`, `status` | Restricted identity validation, auditable closure; no case narrative in core |
| `content_reports` | `id`, `content_ref`, `reason_category`, `reporter_ref`, `review_status` | Protect reporter identity; no public allegation index |
| `moderation_actions` | `id`, `content_ref`, `policy_ref`, `action`, `reviewer_ref`, `appeal_ref` | Versioned rules, rationale, appeal and audit; protect confidential details |
| `module_connections` | `id`, `slug`, `base_url`, `contract_version`, `capabilities`, `verification_state` | Signed approved allowlist; never accept arbitrary user URLs |
| `public_projections` | `id`, `source_ref`, `source_version`, `published_at`, `last_verified_at`, `safe_fields` | Strict allowlist, expiration/retraction propagation, no restricted data |
| `outbox_events` | `event_id`, `type`, `subject_ref`, `schema_version`, `delivery_state`, `attempts` | Signed delivery; retry-safe; no unencrypted sensitive payloads |
| `audit_events` | `event_id`, `actor_ref`, `action`, `resource_ref`, `policy_result`, `hash_chain` | Append-only metadata, minimal PII, chain integrity and authorized access |
| `health_observations` | `service_ref`, `checked_at`, `source`, `result`, `freshness_limit` | Unknown/stale is never presented as success |
| `aggregate_metrics` | `name`, `value`, `source`, `window`, `observed_at`, `method` | Actual verified aggregates only; privacy thresholds and provenance |

### Required state machines

**CMS:** `draft -> in_review -> approved -> published -> superseded`, with explicit `rejected`, `withdrawn` and `temporarily_hidden` paths. Any withdrawal that affects a downstream published derivative emits an event and starts a reconciliation task. Preserve public correction statements when appropriate without exposing the underlying private complaint.

**Initiative:** `concept -> planning -> building -> pilot -> live -> paused/retired`. A verified live endpoint is necessary but not sufficient: owner approval, safety readiness and an accurate working CTA are also required. An unreachable endpoint becomes `unverified` in operational telemetry, not automatically `retired`.

**Volunteer interest:** `unconfirmed -> confirmed -> queued -> referred -> closed/withdrawn`; any case-specific matching occurs only in the relevant downstream app and through consent, not in general-purpose public search.

**Privacy:** `received -> identity_or_authority_checked -> scoped -> processing -> completed/partially_completed/denied -> appealed/closed`. Allow pseudonymous submitters to use receipt-based control if the downstream system supports it, without imposing identity proofing that would negate their privacy.

**Email subscription:** `requested -> pending_verification -> active -> unsubscribed/suppressed`. No bulk sending from `pending_verification` and no revival of an unsubscribed recipient without fresh consent.

**Audit:** append-only events with corrections as new events. Sensitive personal content must not be embedded in an immutable ledger; retain removable encrypted payloads and reference IDs. An erasure request must consider legal holds and any irreversible published/publicly replicated copies.

---

## 6. Interoperability / service contracts

The core must ship its own versioned public OpenAPI definition and typed adapter interfaces. Before implementing an adapter, inspect the **actual current code**, published OpenAPI, auth boundary and version of the upstream source. The API paths below are **new proposed core contracts**, not claims that existing engines already expose these endpoints.

### Core HTTP API v1 (illustrative but contractually required)

| Method / route | Authorization | Purpose |
|---|---|---|
| `GET /api/v1/initiatives` | Public | Published manifests with status/capabilities/freshness |
| `GET /api/v1/initiatives/{slug}` | Public | Details, official contact and approved CTA |
| `GET /api/v1/content?type=&cursor=` | Public | Published public content, bounded pagination |
| `GET /api/v1/content/{slug}` | Public | Canonical approved content + revision attribution |
| `GET /api/v1/search?q=&cursor=` | Public | Approved searchable projection with provenance |
| `GET /api/v1/metrics` | Public | Verified aggregates, timestamps, source and definitions |
| `POST /api/v1/interest` | Anonymous/registered + anti-abuse | Consented non-sensitive volunteer interest to private queue |
| `POST /api/v1/subscriptions` | Anonymous/registered + validation | Begin opt-in confirmation; not an active subscription yet |
| `POST /api/v1/subscriptions/confirm` | One-time token | Confirm explicit opt-in |
| `POST /api/v1/subscriptions/unsubscribe` | Authenticated or signed link | Immediately stop further sends |
| `POST /api/v1/content-reports` | Public + rate limit | Privacy-safe content/safety report |
| `POST /api/v1/privacy-requests` | Scoped auth/receipt | Start a request, return private tracking identifier |
| `GET /api/v1/me` | Authenticated | User's own safe account, profile and preferences |
| `PATCH /api/v1/me/preferences` | Authenticated + CSRF checks | Own preferences only |
| `GET /api/v1/admin/*` | Scoped staff | Admin console data: always server-enforced permission |
| `POST /api/internal/v1/events` | Signed m2m only | Ingest versioned allowlisted module events |
| `GET /health` | Public minimal | Process alive + code/release identity, no secrets |
| `GET /ready` | Protected or public minimal | DB/schema and required core dependency readiness |

Standard API response envelopes should include `request_id`, `api_version`, page `next_cursor` where applicable, and structured errors with stable codes. Private endpoints must use `Cache-Control: no-store`. Public caches should have TTLs, revision IDs, invalidation handling and retraction propagation. Use opaque pagination cursors, not leaking internal numeric IDs.

### Event envelope

```json
{
  "event_id": "opaque-uuid",
  "event_type": "public_projection.published.v1",
  "schema_version": "1.0.0",
  "source_service": "approved-source-slug",
  "source_resource_id": "opaque-source-id",
  "occurred_at": "2026-10-10T00:00:00Z",
  "projection_version": "v3",
  "classification": "PUBLIC_APPROVED",
  "payload": { "public_url": "/stories/sample", "title": "Illustrative title" }
}
```

This example contains **synthetic values only**. Production requires authenticated service origin, signature/key-id and freshness/replay protection, allowlisted event types, JSON Schema validation, idempotency on `event_id`, max payload, dead-letter queue, reconciliation and withdrawal events (`public_projection.withdrawn.v1`). Do not include protected content in these events. The public content URL must come from a verified source.

### Integration matrix / source of truth

| External dependency | Current GitHub repository | Core's permitted consumption | Readiness and blocker |
|---|---|---|---|
| Secure Intake & Case Workflow Engine | `neophilism/Secure-Intake-Case-Workflow-Engine` | Scoped secure-handoff/deep link and approved status events; no private case data | Verify authentic live API, service availability and use-case authorization; no assumption that its docs equal deployed readiness |
| The Injustice Project / Injustice Archive | Not yet identified as dedicated repository | **Only** explicitly approved public story cards, corrections and verified withdrawal events | Separate product plan, secure intake + publication review required first |
| FOIA Aggregator | `neophilism/FOIA_Aggregator` | Public records search/metadata and archive links with provenance | Existing archive coverage is expanding; reflect actual coverage only, never imply completeness |
| The Public Record app | Not yet identified as dedicated repository | Public educational content, request templates and optional approved participation status | Wait for distinct app plan/API; never send requests from core on a user's behalf |
| Civic Registry & Transparency Engine | `neophilism/Civic-Registry-Transparency-Engine` | Published, provenance-carrying public record projections | Verify API/export/license and deployed version; do not copy its engine business logic |
| Justice Teams use-case | Not yet identified as dedicated repository | Consented referral and return status only | Depends on Secure Intake Case Workflow and consent-based case matching |
| Compliance, Authorization & Immutable Audit Engine | `neophilism/Compliance-Authorization-Immutable-Audit-Engine` | External policy/authorization/audit decisions for scoped cross-service actions | Use APIs/events, not shared DB; local core retains required application audit trail |
| Liberty Nodes | Not yet identified as dedicated repository | Publish **approved public-only** manifest references; link to verified replica locations | No auto-push before privacy and withdrawal-risk review |
| Witness Corps / One Question / Justice Works / Public Witness / Human Firewall / Boycott | Separate development plans/repositories to come | Initiative cards and capability-negotiated routes | Main core can ship before any of these are implemented |
| Engine Room | `neophilism/Engine-Room` | Deliver actual repo/PR/CI/deploy status via approved manifest and source integrations | Verify `.exechub` contract, actual GitHub PR mappings, Render/Neon sources; never write fictional completion |
| E2EESA | `neophilism/End-To-End-Everywhere-Security-Architecture-Standard` | Per-component data-flow classification, approved security profiles, assurance/evidence matrix | Current release undergoing remediation; no blanket conformance/certification claim |

### Adapter implementation rules

1. **Capabilities, not guesses:** discovery returns contract version, supported methods, auth class, last-verified time and safe public fields; disabled features are clearly unavailable.
2. **No credentials in frontend:** secrets always server-side; API tokens are per-service, minimum scope, rotated and revocable. Browser interactions needing delegated user authority use an explicitly documented standards-based flow only after upstream support is verified.
3. **No universal login assumption:** until compatible identity federation is implemented and tested, external modules may use their own sessions. A single frontend label must not mask disjoint authorization boundaries.
4. **Idempotency and offline behavior:** all mutating requests have idempotency keys; outbox and retry semantics are bounded; failures yield `unavailable`, never invented success.
5. **Reconciliation:** periodic source-of-truth synchronization corrects missed webhooks; stopped/withdrawn public content is removed from local public indexes and caches promptly.
6. **Per-service ownership and version pinning:** document exact upstream commit/tag, OpenAPI SHA, schema version and explicit owner. Do not integrate by importing private folders or relying on moving `main` without a tested compatibility contract.
7. **Rights check:** GitHub visibility does not imply reusable code license; verify licenses before copying packages; consume stable APIs whenever possible.

---

## 7. Security, anonymity, privacy and E2EESA acceptance

### 7.1 Threat model: minimum adversaries

- External attacker exploiting credential theft, injection, XSS/CSRF, SSRF, malicious file content, dependency/supply-chain compromise, DDoS or leaked tokens.
- Malicious user submitting false allegations, spam, forged records, impersonation, doxxing, threats or abusive volunteer offers.
- Abusive moderator/insider attempting to locate or disclose restricted sources, alter consent, silently change publications, export mailing lists or use private material for unrelated purposes.
- Threat actors correlating metadata (IP, time, cookies, referrers, uploaded EXIF/media, notification links) to de-anonymize a contributor.
- Compromised endpoint/device, third-party service, mail provider or analytics provider.
- Fraudulent rights-removal demands or unauthorized attempts to suppress public records.
- Improper server-to-server integration scope, replay, stale content, divergent redaction state or permanent public replication of restricted material.

The repo must contain a threat ledger with likelihood/impact, controls, remaining risk, owner, test evidence and reassessment date. Security gates apply to every PR, not merely the later security-hardening milestones.

### 7.2 Classification and handling

| Class | Examples | Rules |
|---|---|---|
| `PUBLIC_APPROVED` | Published site copy, public initiatives, approved public records | Safe for caches/indexing under publication policy; signed source, revisions |
| `INTERNAL_OPERATIONAL` | Drafts, source status, review notes, most metrics | Staff scopes, audit, appropriate encryption; never public search |
| `PERSONAL_RESTRICTED` | Email, volunteer contact, account recovery info, private reports | Purpose-limited, encrypted at rest/in transit, strict role boundaries and deletion/retention policy |
| `HIGH_RISK_CONFIDENTIAL` | Unpublished allegations, raw evidence, protected source identities, case communications | Not stored by core as a normal feature; delegate to specially authorized downstream engine with reviewed protections |
| `PUBLIC_REPLICATED` | Explicitly approved documents committed to distributed archive | Separate, documented irreversible-dissemination consent/risk decision; no expectation of guaranteed global deletion |

The classification applies to **components and flows**, not entire repositories. Even a public app can have high-risk contact-data paths and a private engine can release public-safe projections. Document browser, API, logs, caching, storage, provider and replica edges separately.

### 7.3 Security requirements and standards

- **E2EESA:** maintain `docs/SECURITY_E2EESA_MATRIX.md` listing every relevant component/flow, purpose, protections, recipient/key authority, metadata exposure, profile version, relevant conformance status, required evidence, explicit not-applicable rationale and unresolved risks. Respect versioned approved profiles, dependencies and downgrade protection. **Do not claim that ordinary HTTPS or at-rest database encryption constitutes end-to-end encryption.** Do not invent cryptographic algorithms or universal profiles. If a needed secure-intake or messaging flow has no production-approved implementation, it remains disabled or redirected to an already-reviewed channel until resolved.
- **Web application security:** target OWASP ASVS **5.0.0** appropriate controls for authentication, access control, APIs, sessions, validation, cryptography, logging and verification. Map each applicable requirement to a test/evidence record.
- **Identity guidance:** apply the principles of NIST SP **800-63-4** to authenticator policy, secure recovery and phishing resistance; do not claim a government assurance level without its defined process and evidence.
- **Accessibility:** target WCAG **2.2 AA** for public/account/admin interfaces, test actual page states and interactions, not only automated lint results.
- **Transport/headers:** HTTPS/HSTS, strict CSP with nonces where appropriate, secure HttpOnly SameSite cookies, CSRF controls for state changes, strict allowlists for redirects, origin checks, clickjacking restrictions, sanitized safe rendering and rate limits.
- **Authorization:** server-side deny-by-default object-level and field-level access; explicit read/write scopes; scoped API tokens; administrative MFA and step-up for sensitive operations; no privilege inheritance from a display role.
- **Secrets:** Render/Neon/identity/mail/B2 secrets only in dedicated secret stores; redact from errors, builds, logs and example files; scoped least-privilege accounts; audit rotations/revocations. Any credential previously shared in chat or committed must be independently assessed and rotated if exposed.
- **Uploads and embeds:** CMS media allowlisted by MIME/magic bytes, sized and scanned; render safe derivatives; strip EXIF/location data for images as appropriate; block executable content and third-party active embeds by default. Sensitive evidence uploads happen in the dedicated intake engine only.
- **Audit:** append-only tamper-evident important-event history, reviewer separation, retention/rotation and integrity verification. Ledger must not be an immutable store of removable personal secrets.
- **Monitoring:** anomaly/abuse signal alerts without pervasive tracking; privacy-safe structured logs with request IDs, source module and outcome; no body dumps, passwords, private evidence, tokens or hidden emails.

### 7.4 Identity, consent and protection of sensitive individuals

- Anonymous visitors must access public material without authentication. Nonessential tracking/cookies must be opt-in or absent; security cookies must be disclosed.
- For sensitive stories, make identity/publicity consequences understandable **before** a link/form transition. Distinguish *anonymous to the public* from *unknown to administrators or infrastructure providers*. Do not promise perfect anonymity, especially under a subpoena, device compromise or traffic correlation.
- Store explicit, versioned and revocable preferences for participation contact, mailing lists, display name/public profile and future publication. No prechecked consents.
- Never make personal testimony, third-party names, faces or locations public solely on the authority of an unrelated volunteer's upload. Employ publication/redaction review.
- For the initial release, do not accept independent accounts or testimony intake from minors through the core. Public reading may remain available; any minor-submission process requires a separate safeguarding/consent policy and legal review.
- No passive location tracking, social graph extraction, fingerprinting, political microtargeting, or bulk export of supporter identities.
- Subject contact is controlled by the affected person and any necessary safety reviewers; volunteers' requests are *offers* routed by permission, not an open direct-message directory.

### 7.5 Privacy, publication, retention and legal safeguards

Implement public privacy notice, purpose-specific terms, editorial/moderation rules, rights/disclosure process, security reporting channel, records-retention matrix and breach/incident playbook before accepting production personal information. Legal counsel must review entity/operator identity, user-contributed content, DMCA/copyright processes, applicable state privacy rules, consent, defamation, minors, election/nonprofit disclosures where relevant, and lawful response to government/court requests. This is a review gate, not an assertion that all these laws necessarily apply.

Retention policy needs explicit periods by data class and approval before launch. Recommended starting design: short-lived access logs (e.g., 30 days unless security hold), restricted audit/security events (e.g., 90 days or longer with documented necessity), verified mailing contact until unsubscribe plus suppression record, inactive accounts reviewed against need, CMS public revisions by documented publication policy, backups on fixed expiration/rotation. Set actual periods through a reviewed retention decision, don't hardcode speculative legal deadlines. Provide bounded data export/deletion workflows, backup-expiration semantics, and independent treatment of valid legal holds.

**Public permanence constraint:** a web retraction can remove material from services operated by the project; it cannot guarantee deletion of third-party copies, crawlers or Liberty Nodes replicas. Disclose this before public replication; for high-risk personal accounts, default **not replicated**. The public archive's aspiration to permanence cannot override safety and truthful withdrawal notices.

---

## 8. Editorial governance, content safety and accountability

### Role matrix (baseline)

| Role | May perform | Must not perform by default |
|---|---|---|
| Visitor | Read public content, report content | See draft, identity or private contact fields |
| Registered supporter | Maintain own preferences, consented interests | See others' private records or edit public site |
| Editor | Draft, update and submit content | Self-approve sensitive publication |
| Publication reviewer | Approve/deny public editorial revisions | Access confidential cases unless separately granted |
| Moderator | Hide/report/escalate public content under policy | Privately identify sources, change consent or erase audit |
| Privacy officer | Handle scoped privacy requests and disclosure incidents | Publish stories without editorial review |
| Program administrator | Manage initiative registry and permitted integration configuration | Read private downstream testimony by default |
| Security operator | Deployment, secrets, monitoring and security incidents | Bulk-export participant data without privileged approval |
| Super administrator | Emergency revocation, recovery, role approvals | Bypass separation-of-duties silently; every action audited |
| Service integration | Explicit API scope only | Human admin access or unrestricted database queries |

### Editorial policies and process

Content labels: `first-person account`, `primary record`, `independently corroborated`, `commentary`, `unverified submission`, `correction`, and `withdrawn`. The labels should describe evidence status rather than political agreement. CMS public pages have ownership, author, reviewed date and sources. Moderation rationale uses published, versioned rules and provides a review/appeal route. In high-risk cases, immediate temporary restriction is permissible pending subsequent independent review. Moderation operations must not silently alter the historical record; publicly visible correction notes should be privacy-filtered.

Separate a visible **Safety and Privacy Center** from marketing copy. It explains how to report dangerous disclosures, request removal, identify security vulnerabilities, avoid posting other people's private data, and get emergency help from real authorities when appropriate (the website is not an emergency response service).

---
## 9. Complete ordered development roadmap — 50 planned PR-sized work packages

**Count:** 50 proposed milestone/work-package IDs (`JFA-01` through `JFA-50`), arranged in five groups. These IDs are **not** expected to equal GitHub's sequential PR numbers; a real mapping must be recorded later. Never count a planned unit as merged until a mapped, real GitHub PR is merged and source evidence is observed. A passing unit test alone does not mean its production integration is enabled or accepted.

**Global definition of done for every work package:** documented diff and ownership; no secrets committed; formatting/lint, typecheck, dependency/license check, relevant unit/integration/negative-path tests, build, migration rollback/compatibility checks if applicable, documented API/schema changes, role/privacy boundary tests if applicable, minimum accessibility checks for UI, threat-model update if security-sensitive, CI pass on the exact merge commit, and updated test/acceptance evidence. If external live verification is unavailable, record the task as **code complete / integration unverified** rather than production complete.

### Group A — Repository, boundaries and verifiable foundations (JFA-01–08)

**JFA-01 — Repository foundation and canonical handoff.**  
**Deps:** None.  
**Deliver:** Use the already-authorized `neophilism/Justic-For-All` repository; README, plan, roadmap, CODEOWNERS/maintainers, PR templates, contribution/security reporting instructions, initial ADR log and exact boundaries.  
**Pass:** Docs render, no implicit live status, ownership established, license decision explicitly pending rather than falsely assumed, no credentials.

**JFA-02 — Dependency and contract census.**  
**Deps:** 01.  
**Deliver:** Audit exact versions, licenses, public URLs, exported contracts, permissions and live readiness for E2EESA, Secure Intake, Civic Registry, Compliance Audit, FOIA Aggregator and Engine Room. Record unresolved integrations.  
**Pass:** Every adapter candidate has a version/source/status and no invented endpoint; licensing/secret concerns tracked.

**JFA-03 — Strict TypeScript monorepo scaffold.**  
**Deps:** 01.  
**Deliver:** `apps/web`, `apps/worker`, `packages/ui/core/contracts/adapters/security`, pinned Node and pnpm, formatting, typecheck, framework config and minimal non-political demo content.  
**Pass:** Clean install/build/test on a fresh clone; all demo material clearly labeled synthetic.

**JFA-04 — ADR architecture and API contract skeleton.**  
**Deps:** 02–03.  
**Deliver:** Domain boundaries, route registry, service health and callback contracts, OpenAPI/schema generation, versioning and API error envelope.  
**Pass:** OpenAPI validates and rejects unsupported contract versions; no domain engine embedded into core.

**JFA-05 — Dedicated database schema and migrations.**  
**Deps:** 03–04.  
**Deliver:** Core-owned PostgreSQL entities from §5, constraints/indexes, migration rules, sanitized development seeds and field classifications.  
**Pass:** Empty and upgrade migrations work, constraints prevent invalid states, restricted data is not in public projections, rollback strategy documented.

**JFA-06 — Local developer environment and configuration validation.**  
**Deps:** 03, 05.  
**Deliver:** Docker Compose local Postgres/mail, `.env.example` (names only), typed config validator, local health/ready, local fixture service adapters.  
**Pass:** One documented bootstrap flow succeeds from clean checkout; missing critical settings fail safely and show no secrets.

**JFA-07 — CI/CD and supply-chain baseline.**  
**Deps:** 03–06.  
**Deliver:** Branch protection recommendations, GitHub Actions lint/types/unit/build, secret scan, dependency vulnerabilities, lockfile validation, migration tests, SBOM/provenance plan, PR checks and artifact retention.  
**Pass:** Intentional bad fixtures fail gates; workflows run read-only on untrusted PRs; no unapproved deployment from forks.

**JFA-08 — Threat model and E2EESA applicability inventory.**  
**Deps:** 02, 04–07.  
**Deliver:** Threat ledger, component/data-flow inventory, attack surfaces, trust boundaries, E2EESA version/profile/evidence mapping and production/security claim exclusions.  
**Pass:** Every flow classified or explicitly justified not applicable; failed/missing assurance is not called compliant; security owners identified.

### Group B — Public UX, content and accessibility (JFA-09–18)

**JFA-09 — Accessible visual system and component library.**  
**Deps:** 03, 08.  
**Deliver:** Responsive typography, design tokens, contrast, buttons/forms, focus indicators, empty/error/loading states, reduced-motion modes and representative page mockups.  
**Pass:** Storybook/preview or equivalent, keyboard navigation, contrast evidence and no misleading disabled calls to action.

**JFA-10 — Navigation, layout and route system.**  
**Deps:** 04, 09.  
**Deliver:** Header/footer, mobile menu, breadcrumbs, semantic landmarks, error/404 pages, legal/footer shell and route manifest from §3.  
**Pass:** All public routes have correct navigation and accessible semantics; no broken visible links.

**JFA-11 — Homepage, About and Principles.**  
**Deps:** 10.  
**Deliver:** Editorially managed mission/home pages, explanation of Justice For All's organizational independence and pathways to stories/records/participation.  
**Pass:** Page is useful with JavaScript disabled; no fabricated success stories, statistics or legal guarantees.

**JFA-12 — Initiative registry and staged availability.**  
**Deps:** 05, 10.  
**Deliver:** Registry schema, versioned manifest validation, admin-safe seed for all approved/planned initiative names and appropriate states, accessible cards/detail pages.  
**Pass:** Each initiative renders honestly as concept/planning/building/pilot/live; inaccessible modules do not present working CTAs.

**JFA-13 — Structured editorial CMS authoring.**  
**Deps:** 05, 09, 12.  
**Deliver:** Draftable pages, articles, resources/FAQs, supporting media metadata, safe rich-text editing and media safety pipeline.  
**Pass:** Drafts remain invisible to public APIs/search; unsafe HTML/uploads rejected; content edit audit present.

**JFA-14 — Review, publication, correction and rollback.**  
**Deps:** 13, 08.  
**Deliver:** Editorial state machine, versioned publishing, two-person signoff for high-risk material, withdrawal/replacement workflows and previews.  
**Pass:** Unauthorized publish/review self-approval denied, revisions immutable, withdrawal removes public cached projection.

**JFA-15 — Fast public content rendering and attribution.**  
**Deps:** 13–14.  
**Deliver:** SEO-safe published pages, source/author/review date, record/evidence labels, media alt/caption placeholders and safe embeds.  
**Pass:** Only approved versions appear; public cached data revalidates on change; user-provided allegations never auto-label as verified.

**JFA-16 — Guided participation and resources hub.**  
**Deps:** 11–12, 15.  
**Deliver:** Get Involved paths, plain-language module availability, safety/participation guidance, contact center and resources index.  
**Pass:** Visitors can find the chosen program in two steps; unavailable submission workflows route to explanations, not broken forms.

**JFA-17 — Approved-only site search.**  
**Deps:** 05, 14–15.  
**Deliver:** PostgreSQL public CMS search, safe snippet generation, pagination/filtering, noindex restrictions and source attribution.  
**Pass:** Draft/private fields never appear by direct query, stemming or snippets; withdrawn content is excluded after invalidation.

**JFA-18 — Accessibility, localization and search-engine foundation.**  
**Deps:** 09–17.  
**Deliver:** WCAG 2.2 AA baseline check, internationalization architecture with English launch copy, plain-language content standard, sitemaps/robots/public-only Open Graph, mobile/low-bandwidth QA.  
**Pass:** Automated and human keyboard/screen-reader walkthrough pass for public journeys; restricted pages not indexed; future locales do not require schema changes.

### Group C — Identity, consent, moderation and trusted participation (JFA-19–29)

**JFA-19 — Identity provider evaluation and user lifecycle.**  
**Deps:** 05, 07–08, 18.  
**Deliver:** Record actual selected maintained auth library/provider, passkey/verified email configuration, sign-up/sign-in/sign-out, recovery, delete/deactivate account.  
**Pass:** Test verified login, anti-enumeration, throttling, device/session invalidation, and failed recovery; no unnecessary ID verification.

**JFA-20 — Strong privileged authentication and session security.**  
**Deps:** 19.  
**Deliver:** Phishing-resistant MFA options for staff, step-up for sensitive admin actions, reauthentication, recovery and session controls.  
**Pass:** Stolen session cannot exercise privileged step-up; lockout/recovery abuse and token replay negative tests pass.

**JFA-21 — Core RBAC/ABAC and service authorization.**  
**Deps:** 19–20, 08.  
**Deliver:** Roles from §8, resource-level policies, organization and source scopes, server-enforced checks for every core route/field.  
**Pass:** Role/permission matrix integration tests deny cross-role and cross-subject requests, including guessed IDs and direct API calls.

**JFA-22 — Anonymous/pseudonymous public journeys.**  
**Deps:** 16, 19, 21.  
**Deliver:** Anonymous public browsing, optional public pseudonym, purpose-limited session metadata, plain-language anonymity boundaries and secure links to external protected intake.  
**Pass:** Public use requires no registration; pseudonym cannot reveal internal identity/contact; tests exercise tracking/referrer/metadata leakage risks.

**JFA-23 — Consent ledger and self-service preferences.**  
**Deps:** 19, 21–22.  
**Deliver:** Purpose/version-specific consent records, export/withdrawal, privacy choices and changed-policy re-consent where necessary.  
**Pass:** Missing consent rejects optional processing; revocation stops future flow; old consent scope cannot authorize new purpose.

**JFA-24 — Subscription/email notification lifecycle.**  
**Deps:** 23, 06.  
**Deliver:** Provider-neutral transactional email, verified sender, double opt-in for campaigns/news, unsubscribe, suppression, template safety, delivery state and local mail fixtures.  
**Pass:** No mass email to unconfirmed/unsubscribed contact; no private case details in email; failures retry idempotently.

**JFA-25 — Skill-based volunteer interest intake.**  
**Deps:** 16, 21–24.  
**Deliver:** Minimum-needed private interest form, approved helper categories, consent, private admin queue and future referral interface to Justice Teams.  
**Pass:** No volunteer list publicly exposed; private contact restricted, withdrawal possible; no claim a case match exists before downstream confirmation.

**JFA-26 — Content reporting and moderation workflow.**  
**Deps:** 14, 21, 28 when available (local audit interface initially).  
**Deliver:** Structured reports, temporary hides, reviewer queues, versioned reason codes, appeals and evidence-safe notifications.  
**Pass:** Reports cannot reveal complainant identity or draft evidence; tested appeal and improper-removal recovery paths.

**JFA-27 — Privacy requests, safe takedown and legal hold workflow.**  
**Deps:** 21–23, 26.  
**Deliver:** Private request portal, identity/receipt-based authority checks, scoped deletion/export/correction, withdrawal propagation hooks, exception/legal hold review and status receipts.  
**Pass:** Unauthorized users cannot retrieve another's records; public/distributed deletion limitations disclosed; all decisions auditable.

**JFA-28 — Tamper-evident core audit and administrative reviews.**  
**Deps:** 05, 21, 23.  
**Deliver:** Append-only administrative/content/consent action stream, integrity verification, separation-of-duties approval tracking and privacy-safe event fields.  
**Pass:** Unauthorized update/delete rejected; tampering detected; crypto or integrity mechanism documented, without private raw stories in ledger.

**JFA-29 — Abuse prevention and web/API security hardening.**  
**Deps:** 17, 19–28.  
**Deliver:** CSRF/XSS/SSRF/upload protections, CAPTCHA-free low-friction anti-abuse where possible, risk-based rate limits, device/session anomaly reporting and security alerts.  
**Pass:** OWASP ASVS control mapping and negative tests; no bot defense that systematically prevents assistive/anonymous public use without an alternative.

### Group D — Real, versioned upstream integration boundaries (JFA-30–40)

**JFA-30 — Adapter SDK, API/event schemas and outbox.**  
**Deps:** 04, 05, 07, 21, 28–29.  
**Deliver:** Adapter interface, schema/version checking, service registry, signed webhook ingestion, outbox/inbox deduplication, retries/dead-letter handling and status verification.  
**Pass:** Replay/stale/forged event rejection; contract tests and missing-provider fail-closed UI; no browser-held service secret.

**JFA-31 — Delegated access and identity-federation boundary.**  
**Deps:** 19–21, 30.  
**Deliver:** Auth interop ADR, signed service identity, scoped delegated authorization design, account linking only when external identity contract confirmed.  
**Pass:** No false single-sign-on; when unsupported, link out to independent authenticated app, with safe redirect and clear session boundary.

**JFA-32 — Secure Intake guided handoff adapter.**  
**Deps:** 22–23, 30–31.  
**Deliver:** Functioning capability probe, protected link/token handoff only if supported by verified Secure Intake API, privacy disclosure/receipt experience and link fallback.  
**Pass:** No raw sensitive narrative in core; unsupported/degraded intake does not accept evidence or display a success receipt.

**JFA-33 — Injustice Archive approved-public adapter.**  
**Deps:** 17, 27, 30, 32; external application availability optional.  
**Deliver:** Public story projection schemas, provenance/evidence labels, safe search and withdrawal reconciliation, read-only placeholder fixtures.  
**Pass:** Only publication-approved fields render; synthetic fixtures clearly marked; external live status remains unverified until app exists.

**JFA-34 — FOIA Aggregator read-only adapter.**  
**Deps:** 17, 30.  
**Deliver:** Public search/record deep links, official source metadata, archive freshness/corpus coverage indicators, caching bounds and error handling.  
**Pass:** Verified source links and record counts only; no private/admin aggregator paths; record availability not confused with complete FOIA coverage.

**JFA-35 — The Public Record gateway contract.**  
**Deps:** 12, 30, 34; external application availability optional.  
**Deliver:** Participation/info page, distinct request-workflow adapter contract, real deep link only after independent deployment, safe template preview.  
**Pass:** Core cannot submit government requests or represent the user without an explicitly authorized working downstream feature.

**JFA-36 — Civic Registry public-data adapter.**  
**Deps:** 17, 30.  
**Deliver:** Versioned public registry search/provenance integration and safe link-out; no duplicate registry engine.  
**Pass:** Source authentication/attribution, pagination, offline/failure state, version compat and withheld/private field rejection tested.

**JFA-37 — Justice Teams and Secure Case Workflow referral interface.**  
**Deps:** 25, 30, 32; downstream product availability optional.  
**Deliver:** Consented scoped offer referral contract and safe acknowledgement, potential future case-tracking link behind external auth.  
**Pass:** No automatic sharing of testimony or source identity; repeated referrals deduplicated; disabled when downstream capability missing.

**JFA-38 — Compliance/Audit Engine adapter.**  
**Deps:** 21, 28, 30.  
**Deliver:** Optional policy-decision and audit anchoring calls for cross-app actions, versioned signed references, local safe fallback/deny policies.  
**Pass:** Failure never converts denial to approval; tamper and stale-policy tests; actual remote use not claimed without live verification.

**JFA-39 — Liberty Nodes publication/replica adapter.**  
**Deps:** 27, 30, 33; external application availability optional.  
**Deliver:** Public-only export manifest format, manual documented permission/replication gate, hashes and replica provenance, withdrawal-limit disclosure.  
**Pass:** Negative tests prohibit publishing restricted/pseudonymous-only/unreviewed material; no auto-replication or guarantee of later worldwide deletion.

**JFA-40 — Remaining initiative contracts and progressive rollout.**  
**Deps:** 12, 16, 30.  
**Deliver:** Well-labeled staged module cards and typed adapter placeholders for Witness Corps, One Question, Justice Works, Public Witness, Human Firewall / Consent Strike and Surveillance-Enabler Boycott.  
**Pass:** Each initiative has full descriptions and safe routing but no invented app status, user count, incident or service. Each actual downstream implementation follows its separate plan.

### Group E — Administration, operational hardening, deployment and independent handoff (JFA-41–50)

**JFA-41 — Unified administrative workspace.**  
**Deps:** 12–14, 21, 23, 26–28, 30.  
**Deliver:** Accessible role-scoped admin pages for editorial queues, initiative controls, user permissions, privacy requests, reports, integration states and audit receipts.  
**Pass:** Role matrix/CSRF checks across UI and API; staff cannot browse unrelated private case data.

**JFA-42 — Truthful public measures and source evidence.**  
**Deps:** 12, 17, 30, 41.  
**Deliver:** Small public aggregate stats (if verified) and internal source monitoring: data definitions, last updated, source and partial/unknown flags.  
**Pass:** Unavailable count displays `unverified`, not zero; no calculated participation claim from synthetic fixtures; metrics respect privacy thresholds. Full cross-program dashboard is a separate future plan.

**JFA-43 — Health, telemetry and reliable notification operations.**  
**Deps:** 24, 30, 41–42.  
**Deliver:** Liveness/readiness, release SHA, failure alerts, webhook delivery monitors, worker backlog, provider failures and externally observed availability, with routing runbooks.  
**Pass:** Kill downstream API/email/DB in test and prove degraded/unknown states + actionable alerts; no sensitive payloads in telemetry.

**JFA-44 — Data lifecycle, backups, restore and continuity.**  
**Deps:** 05, 23, 27–28, 43.  
**Deliver:** Approved retention rules, encryption/key rotation, tested offsite backup, point-in-time recovery where supported, restore drill, deletion backup aging, incident response and rollback.  
**Pass:** Restore a separate environment and compare expected schema/data checks; document RPO/RTO measured, not assumed.

**JFA-45 — Staging infrastructure and repeatable release.**  
**Deps:** 07, 29–30, 41–44.  
**Deliver:** Separate authorized Render/Neon staging resources, environment secret management, managed migrations, background-worker schedule verification, GitHub deploy integration and smoke checks.  
**Pass:** Verified correct workspace/service/account, no production keys in staging; migration deploy/rollback and schedule tests with evidence.

**JFA-46 — Performance, scale, availability and public SEO.**  
**Deps:** 15–18, 34, 42–45.  
**Deliver:** Caching/CDN strategy, sitemap/robots/noindex, low-bandwidth route optimization, load tests, source-projection cache busting and pagination pressure tests.  
**Pass:** Meet published performance/availability targets in target environment; hidden/private data never cached publicly; retractions revalidate appropriately.

**JFA-47 — Cross-browser/accessibility/UX acceptance.**  
**Deps:** 18–46.  
**Deliver:** Full Playwright E2E suite, accessibility manual evidence, browser/device matrix, key workflow recordings or test notes, internationalization/contrast/reduced-motion and usability review.  
**Pass:** All critical journeys can be completed without mouse, no critical WCAG 2.2 AA failures, no broken visible links or false state labels.

**JFA-48 — Security/privacy review and tabletop exercises.**  
**Deps:** 08, 19–47.  
**Deliver:** Pen-test or independent review appropriate to risk, dependency and E2EESA applicability report, attack drill (doxxing, impersonation, leaked token, stolen admin session, forged webhook, withdrawal/replica incident), privacy/governance signoff.  
**Pass:** Critical/high findings resolved or explicitly release-blocked; demonstrate exploit reproduction/fix evidence; no unsupported conformance claims.

**JFA-49 — Production launch and operational acceptance.**  
**Deps:** 44–48 and legal/privacy policy signoff.  
**Deliver:** Provision authorized production Render/Neon, domain/TLS/mail if available, verified production migrations, safety pages, backup/restore, rollback, uptime probe, and constrained rollout with real smoke tests.  
**Pass:** Measured production checks, verified operator ownership, no dummy accounts/test metrics, published security/privacy policies and recorded outstanding external dependencies. Do not mark optional downstream modules live until separately accepted.

**JFA-50 — Engine Room registration and cross-account handoff closure.**  
**Deps:** 01–49, actual source and deployment evidence.  
**Deliver:** Approved `.exechub/project.yml` with 50 planned units, milestone breakdown and **verified actual GitHub PR mapping** (not ordinal guesses); Engine Room project/source checks, final `docs/HANDOFF.md`, ADR index, architecture/security/operations/deployment runbooks, API specs, migrations, coverage reports and remaining work register.  
**Pass:** Fresh account can clone, boot local, test, understand security scope, verify environment and deploy with issued credentials. Engine Room shows actual merged PR observations separately from production-ready status; blockers and missing source data explicit.

### Parallelism, release gates and feature readiness

- **Safe parallel tracks:** UI JFA-09–12 may develop beside authentication groundwork after JFA-03/04/08; documentation/test harness can proceed alongside adapters. Use small dependent PRs and avoid competing migrations without coordination.
- **PR merge policy:** After all required checks pass and reviewer/security gates are satisfied, low-risk approved PRs may be merged and the next task begun. Never auto-merge a failing check, unresolved conflict, breaking API change, unresolved migration safety concern, new cryptographic primitive/profile, new external expense, irreversible public replication or production disclosure without the appropriate approval.
- **External dependency policy:** An adapter can be **code complete** with fixtures when the downstream service does not yet exist; it must be labeled **integration pending**, keep public feature disabled and list exact evidence needed to turn it on. Never block the whole core site because a later initiative is not yet built.
- **Release-stage policy:** `developer preview` after foundations; `public content beta` after safe CMS and accessibility completion; `account/participation beta` only after identity/privacy/moderation/notification security tests; `integrated pilot` only with verified live upstream adapters; `production core` only after JFA-49 and acceptance record. No date guarantee independent of service and signoff.

---
## 10. Quality engineering, measurable service goals and test matrix

### Test layers

| Layer | Required tests | Mandatory failure/abuse cases |
|---|---|---|
| Domain unit | State machines, typed validators, version checks, consent logic, publication rules | Forbidden transition, expired consent, duplicate message, invalid document type |
| Data/integration | Fresh and upgraded Neon-compatible Postgres, foreign keys, tx rollback, outbox, provider adapters | Transaction rollback, duplicate idempotency key, schema mismatch, query scope escape |
| API contract | Generated OpenAPI/client matching, positive/negative auth, bounded cursor, safe caching | Unknown API version, forged signature, cross-resource IDOR, private-field overfetch |
| Browser E2E | Home -> initiative -> CTA, search, editor lifecycle, opt-in, role-specific admin, reporting, privacy request | Broken route, partially loaded module, unauthorized editor action, keyboard focus loss |
| Security | Dependency/secret scan, SAST, ASVS mapping, authorization fuzz, headers, upload parsing, CSRF/XSS/SSRF | Admin recovery bypass, forged webhook, session replay, malicious file, raw-PII logging |
| Privacy | Anonymous browsing, pseudonym boundary, separate consents, retention, withdrawal, safe projections | Private story indexed, identity via referrer/log, contact visible to unauthorized helper, replica leak |
| Accessibility | Automated axe-type checks plus manual keyboard/screen-reader/mobile/speech input | Trapped focus, non-announceable validation, missing label/transcript, low contrast |
| Operational | Build, deployment, migration, restore, monitoring, queue retries, failover and rollback | Service asleep, DB loss, stale source, missed webhook, unsubscribed email send, failed restore |
| Performance | Synthetic load, repeat navigation, web vitals, cache purge, partial upstream timeout | Unbounded query, slow source locks home page, stuck outbox, cache exposing private page |
| Source/rights | Attribution, evidence labeling, publication rights, withdrawal/appeal | False corroboration label, missing provenance, unauthorized public artifact, withdrawn public search hit |

### Proposed release SLOs and proof requirements

The following are **initial engineering targets** to measure, not present-tense claims: p75 mobile public LCP at most 2.5s, INP at most 200ms and CLS at most 0.1 on representative traffic; zero critical accessibility and high/critical unfixed security findings; all core P0 workflows passing 100% on supported production browser suite; zero publicly indexed restricted records; 100% privileged mutations authorization-checked and audit-referenced; 100% emails after unsubscribe suppressed (allowing already-queued/in-flight provider edge cases to be explicitly handled). Aim for 99.5% monthly availability **only if hosting and monitoring can support it**. A sleeping/free service cannot honestly have the same guaranteed service level as a provisioned always-on environment. Proposed initial disaster-recovery goals RPO <=24h and RTO <=24h, but sign off only once verified against real Neon/object-store restore drills. Document actual measured times.

### Definition of complete (not a percentage-only measure)

A unit passes *source acceptance* if its merged PR and CI evidence meet its definition of done. An adapter passes *external integration acceptance* only with a verified, permissioned real upstream endpoint and negative/failure tests. The **core platform** passes *production acceptance* when JFA-49 evidence is complete. None of these imply downstream initiatives are live or that E2EESA security certification has occurred.

---

## 11. Deployment, configurations and operational runbook

### Environment stages

- **Local:** local database/mail sink with synthetic content; zero external mail, zero production credentials.
- **CI/test:** ephemeral database, fake provider adapters, test mail; no personal information or real user data.
- **Staging:** its own Neon database, Render service(s) and test-domain accounts; provider sandbox; synthetic/minimized datasets; production-like release and restore drills.
- **Production:** separate dedicated Neon database/roles, least-privilege web DB role, migration credential separation, Render web service, independently verified worker/scheduler if jobs are essential, separate private object-store bucket, email sender domain and monitored HTTPS domain.

### Secret names and role separation (names only; never fill values in plan)

```
NODE_ENV
APP_PUBLIC_URL
DATABASE_URL
DATABASE_URL_UNPOOLED       # only if provider offers distinct migration endpoint
SESSION_SIGNING_KEY
AUTH_PROVIDER_CONFIG
AUTH_PASSKEY_RP_ID
EMAIL_PROVIDER_API_KEY
EMAIL_FROM_ADDRESS
PRIVATE_STORAGE_ENDPOINT
PRIVATE_STORAGE_BUCKET
PRIVATE_STORAGE_KEY_ID
PRIVATE_STORAGE_SECRET_KEY
SERVICE_WEBHOOK_SIGNING_KEYS
RENDER_DEPLOY_CONFIG
INTERNAL_MONITORING_TOKEN
SECURITY_ALERT_DESTINATION
```

These are illustrative names; the app must define and validate its final names. Values live in service secret storage; `.env.example` must not include credentials. Existing credentials published in conversation/issue text are **not** safe to embed in a new repo or deployment plan. Never share a high-privilege admin token across two services.

### Deployment sequence

1. Confirm GitHub repository name, owner and rights; use clean main/branch protection and pinned tooling.
2. Provision separate authorized Render and Neon resources for this specific app (do not borrow unrelated project databases). Obtain explicit approval before paid provisioning.
3. Issue minimum-role DB service, migration, mail and object-store keys; set rotation owner and expiration.
4. Verify DNS/TLS, callback allowlists, same-site cookie settings and security headers.
5. Run signed build and migration dry-run; snapshot database; apply migration using only migration role; verify `/health` and `/ready`.
6. Deploy a specific commit SHA/image digest; smoke-test public pages, authentication, consent/unsubscribe, admin access denial, search, reporting and privacy requests. Unavailable modules must show truthful safe fallbacks.
7. Run public external probes plus authenticated operations checks, background scheduled job test and queue monitoring; configure alert destination.
8. Prove restoration into separate environment and documented rollback to compatible prior revision.
9. Record release SHA, schema version, E2EESA inventory version, downstream API pins, approved flags, actual CI links, deployment URL, live validation timestamp and unresolved risks in `docs/ACCEPTANCE_EVIDENCE.md`.
10. Mark core `production` only when the launch checklist is signed. Register factual state in Engine Room; never infer an uptime/backup result from a green merge alone.

### No-external-resource fallback

Core site functionality and development can proceed with stub adapters, local Postgres, local email sink and synthetic content without a domain, mail sender, FOIA service API keys or paid object storage. However no volunteer-contact email sending, background guaranteed scheduled tasks, production authentication or production deployment may be claimed until those dependencies are actually configured and verified. Do not ask the project owner to decide ordinary tooling details that engineering best practices resolve; request only actual credentials, provisioning permission, jurisdiction-specific legal/editorial choices or material security risks.

### On-call and incident response

Create severity levels and incident owners. Severity 1 includes evidence/contact exposure, suspected compromise of privileged account, a public projection containing restricted identity, or forged cross-service publications; immediate action may include disabling module route, halting outbox, revoking key, unpublishing projection, securing evidence and notifying designated officers. The privacy/security runbook must cover preservation, containment, analysis, impacted-user notification decisions and post-incident review. All response logs minimize personal content. Exercise one production-relevant tabletop before first real testimony referral.

---

## 12. Risk register / mitigations

| Risk | Severity | Mitigation and evidence |
|---|---|---|
| Participant identity accidentally disclosed | Critical | Strict public projection allowlist; safety review; identity/contact isolation; privacy test suite; no raw testimony in core |
| Unsupported promise of full anonymity or E2EE | Critical | Plain-language threat disclaimers; E2EESA component/flow inventory; scoped profile claims and independent evidence |
| False or defamatory allegations published as fact | High | Evidence-status labels, provenance, human review, corrections/takedown/appeals and no automatic corroboration |
| User submission permanently replicated before consent | Critical | Liberty Nodes disabled by default; dual approval, publication rights + risk disclosure and unreplicated default |
| Compromised administrator or integration token | Critical | Privileged MFA/step-up, tight scopes, server secrets, rotation, signed events, anomaly alerts |
| Inaccurate live-progress/statistics | Medium-high | Source timestamps, explicit `unverified` states, Engine Room approved mapping and clear stage labels |
| Duplicate work across engines | Medium-high | Architectural source-of-truth rules, versioned APIs, no direct cross-service DB, reuse-license checks |
| Hosting cost surprises or sleeping scheduler | Medium | Confirm prices/limits, paid provisioning requires authorization, run schedule acceptance, degrade honestly |
| Denial-of-service and abusive mass signups | High | Rate limits, queues, cache isolation, privacy-conscious friction and operational alerting |
| Legal/copyright/privacy complaint mishandling | High | Counsel-reviewed content/rights procedures, scoped takedown and recorded appeal/legal hold |
| Email leaks details or ignores unsubscribe | High | Generic templates, minimal metadata, suppression list, end-to-end delivery tests and alerts |
| Backups appear configured but cannot restore | High | Periodic documented independent restore test; objective RPO/RTO evidence |
| Adapter assumes a missing upstream endpoint | Medium-high | Repo/source/API census, consumer contract tests, feature flags and disabled-state UX |
| Unusable experience for nontechnical participants | Medium-high | Accessible mobile-first site, ordinary HTTPS gateway, no IPFS/key requirement, user research |

---

## 13. Engine Room registration and PR-tracking truth policy

The current Engine Room project uses an approved `.exechub/project.yml` manifest and a separate reviewed mapping of *actual* GitHub PR numbers to approved roadmap items. It does **not** assume that `JFA-25` means GitHub PR `#25`. The manifest skeleton below is **draft only**; set `approved: true` only after plan approval and schema validation against the actual Engine Room implementation:

```yaml
project:
  name: Justice-For-All-Core-Platform
  display_name: Justice For All — Core Platform
  repository: neophilism/Justic-For-All
  status: planned

roadmap:
  version: 1
  planned_prs: 50
  approved: false

milestones:
  - name: Foundations and architecture
    prs: 8
  - name: Public experience and publishing
    prs: 10
  - name: Identity privacy and moderation
    prs: 11
  - name: Cross-platform integrations
    prs: 11
  - name: Operations and release
    prs: 10
```

**Validation before adoption:** check the actual manifest schema and valid project status enum in Engine Room; use its approved-plan workflow. After work starts, write a mapping file with exact repo-local PR identifiers and merge status; source every completed count from GitHub's actual merged timestamps. A code-complete adapter awaiting an external service remains `integration unverified`. Publish separately (i) milestones merged, (ii) CI test status, (iii) Render deploy SHA, (iv) live health, (v) backup/restore outcome, and (vi) independent security acceptance; these are different kinds of progress.

---

## 14. Independent-agent operating instructions

An agent receiving this plan **must**:

1. Read this entire document, current `README.md`, ADRs, `docs/ACCEPTANCE_EVIDENCE.md`, dependency README/DEVELOPMENT_PLAN files, E2EESA audit remediation and Engine Room live integration docs. Treat current repository source and live provider state as authoritative over stale conversations.
2. Check the repository actually exists; if not, begin with JFA-01 when authorized. Never claim it has been created simply because this plan names it.
3. Inventory current branches/open PRs/merged PRs, workflow checks, tags, migrations and deployment before writing code. Do not duplicate already-implemented milestones or confuse maintenance PR numbers with planned unit IDs.
4. Record a concise PR acceptance checklist and dependency/version pins for each milestone. Keep each PR narrowly scoped, working at merge and testable without unavailable upstream services.
5. Implement in dependency order; chain reviewed, green, low-risk PRs, including safe auto-merge when permitted; confirm merge happened before creating a dependent PR based on it. Stop on genuine failed CI, conflicts, secrets, risky architecture/design decisions or irreversible live operations, and report the smallest actionable blocker.
6. Refuse to call an integration, encryption claim, backup, uptime reading or production release successful without **observed evidence**. Distinguish mocked fixtures from live integration; report unknown states as unknown.
7. Review security profiles at component/data-flow granularity and verify applicable E2EESA status; do not pick experimental/provisional profiles as production recommendations by convenience.
8. Never print private user data or provider secrets into tests, PR descriptions or logs. Use synthetic fixtures and redacted reproducible debugging.
9. Keep repository plans, README/ADRs, APIs and operation runbooks updated in the same PR as functionality. Avoid dependence on ChatGPT memory or a specific account.
10. After each merge, update approved roadmap-to-PR mapping, acceptance evidence and Engine Room integration where available. If external authorization is needed, explain exactly what service/credential/right is missing without requesting other secrets.

### Per-PR standard handoff record

```text
Work-package ID: JFA-XX
Actual repository + PR: (observed URL)
Merged commit SHA: (observed)
Purpose and changed components:
Dependencies and source version pins:
Database migrations and rollback:
API/schema changes:
E2EESA flow classification/profile/evidence change:
Tests and results (CI URL, commit):
Manual verification and environments:
External live integration evidence or pending status:
Security/privacy/accessibility findings:
Operational/deployment changes:
Open blockers and next unblocked milestone:
```

### Acceptance-evidence checklist for final handoff

- [ ] Actual repository exists with handoff docs, source, build scripts and pinned dependencies.
- [ ] All 50 planned milestone IDs have approved dispositions and real PR links or explicit deferral records.
- [ ] Clean clone -> local boot -> unit/integration/E2E CI passes from docs without private chat context.
- [ ] All public pages, links, forms and degraded-module pathways function and remain accessible.
- [ ] Privileged routes enforce roles, MFA, consent and privacy rules; high-risk content never indexed.
- [ ] Publication revisions, corrections, moderation, report appeals and retraction reconciliation have evidence.
- [ ] Upstream integrations have pinned contracts, separate secrets and verified production flags **or** are clearly disabled.
- [ ] E2EESA applicability table, threat model, code scan, human review and unresolved risk register present.
- [ ] Verified database backup and restoration, scheduler behavior, health and security alerts are recorded.
- [ ] Live Render/Neon deployment, public URL, release identity and rollback runbook are verified, if launched.
- [ ] Engine Room reflects observed repo PRs/deployments/status without invented progress.
- [ ] Legal/editorial operator, policies, contact address and incident authority are documented.
- [ ] Another developer account can operate and extend the repo using these files alone.

---

## 15. Remaining product decisions and engineering defaults

These are **not** reasons to defer writing the codebase. Apply the documented default unless an actual user/legal decision is needed.

| Item | Default / required later decision |
|---|---|
| Repository name | Proposed `neophilism/Justic-For-All`; no GitHub repo currently confirmed under this name |
| Core product owner | Project owner who authorizes creation, credential issuance and deployment; record role privately in repository operations contact, not hardcoded into public source |
| Public site domain | TBD; use staging Render-generated URL until authorized domain assigned |
| Organization relationship | Movement initially structurally independent of a political party; include optional public disclosure of affiliation if later adopted |
| Licensing | **Requires explicit license decision** before publishing any proprietary reusable package or copying code from other repos with unclear rights; no assumed license |
| Product appearance | Editorial, readable, inclusive and inviting; no unapproved political-party branding; aesthetic assets and name use tracked by the CMS |
| Hosting | Render + dedicated Neon; request authorization only for actual account/workspace/cost, not architecture advice |
| Object storage | Dedicated B2-compatible bucket if needed, never reuse FOIA Aggregator's object store; restrict private media to downstream service |
| Email provider | Adapter default, real production choice by availability/deliverability/cost; no messages sent until verified sender domain and opt-in |
| Authentication | Maintained passkey/verified email approach with privileged MFA; select exact audited provider in JFA-19 after comparative review |
| Testimony publication | Downstream application controls approval, redaction, source handling and consent; **nothing private is published by core** |
| E2EESA production claim | None by default; require documented scoped evidence, stable profiles and security review before adopting any claim |
| External integrations | Feature-off with explanatory page until exact contract, auth and live source have been verified |
| Analytics | Anonymous coarse aggregate operational measures only; optional analytics must not track civic beliefs or private behavior |
| Legal/retention policy | Counsel/editorial review required before collecting real sensitive data, public accusation publication or legal-state-specific action guidance |
| Funding/payments | No donation/payment stack without separately approved scope and legal/financial infrastructure |
| Use of personally identifiable email for alerts | Configure private operational `SECURITY_ALERT_DESTINATION`; do not put a particular person's email in public repository code |

### Trigger conditions for changing the architecture

Only revisit the proposed stack if a measurable blocker emerges: verified engine APIs cannot express required privacy guarantees, E2EESA production profile/evidence requires a different transport/auth architecture, accessibility cannot be met, a security assessment rejects the design, or cost of safe deployment exceeds an approved budget. Record an ADR, compare options, migrate carefully. Do not rewrite the stack merely because a different agent prefers a new framework.

---

## 16. Authoritative references for future implementers

**Existing related repositories (inspected October 10, 2026):**

- End-To-End-Everywhere Security Architecture Standard: https://github.com/neophilism/End-To-End-Everywhere-Security-Architecture-Standard — especially `docs/DEVELOPMENT_PLAN.md`, `docs/AUDIT_REMEDIATION_PLAN.md`, component/data-flow definitions and conformance engine. Audit remediation means downstream implementation is **not automatically E2EESA-certified**.
- Secure Intake & Case Workflow Engine: https://github.com/neophilism/Secure-Intake-Case-Workflow-Engine — `docs/DEVELOPMENT_PLAN.md` and versioned documented API/contracts.
- Civic Registry & Transparency Engine: https://github.com/neophilism/Civic-Registry-Transparency-Engine — `docs/DEVELOPMENT_PLAN.md` and actual public projection interfaces.
- Compliance, Authorization & Immutable Audit Engine: https://github.com/neophilism/Compliance-Authorization-Immutable-Audit-Engine — `docs/DEVELOPMENT_PLAN.md`, current API and event specification.
- FOIA Aggregator: https://github.com/neophilism/FOIA_Aggregator — `docs/DEVELOPMENT_PLAN.md`, source-coverage and public access docs; archived coverage may be incomplete.
- Engine Room: https://github.com/neophilism/Engine-Room — `docs/DEVELOPMENT_PLAN.md`, `docs/live-project-integration.md`, `.exechub/project.yml` and observed approved mapping.

**External reference baselines (verify latest version before implementation):**

- W3C Web Content Accessibility Guidelines 2.2: https://www.w3.org/TR/WCAG22/
- OWASP Application Security Verification Standard 5.0.0: https://owasp.org/www-project-application-security-verification-standard/
- NIST SP 800-63-4 Digital Identity Guidelines: https://csrc.nist.gov/pubs/sp/800/63/4/final

**Priority order for conflicts:** applicable law and immediate safety; explicit current owner decisions; implemented current source/contracts and measured production environment; approved versioned development plans/ADRs; earlier conversation recollections; proposed defaults in this document. Never silently reinterpret legal or security constraints from downstream material.

**Final handoff condition:** The repository, when eventually created, must contain this document as `docs/DEVELOPMENT_PLAN.md` plus the referenced architecture, privacy, API, test, deployment and operations documents. The user should be able to tell another ChatGPT account to work on `neophilism/Justic-For-All` and have the agent determine precisely what exists, what remains, how to test it, how to deploy it, what must remain private, and where to obtain *authorized* credentials—without needing the original conversation.