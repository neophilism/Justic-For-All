# Independent developer / agent handoff

**Authoritative scope:** [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) (50 numbered work packages). **Current product:** early static public portal; do not assume real submission, login, moderation, or deployed production.

## First actions in another account

1. Read `README.md`, this handoff, `docs/DEVELOPMENT_PLAN.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/ACCEPTANCE_EVIDENCE.md`, all ADRs and `.exechub/project.yml`.
2. List real GitHub PRs and GitHub Actions runs. Never mistake JFA work-package IDs for actual PR numbers or infer completion from main-branch bootstrap commits.
3. Read the pinned integration repository's public code/docs and version metadata. Do not infer authentication or a live endpoint from a README/example.
4. Check the actual Render/Neon resources in the authorized workspace before provisioning or billing anything. No verified deployment exists merely because a repository was initialized.
5. Pick the next uncompleted package with dependencies satisfied. Develop in a branch; open PR; run test/CI; merge only after checks and acceptance evidence, then update approved real-PR mapping.
6. Configure Engine Room's authenticated reconciliation to import live GitHub records; verify visible timestamps. A checked-in manifest alone is not proof the dashboard has updated.

## Core invariants

- Public browsing without signup; consent required for optional features.
- No generic testimony upload or public display of private allegations.
- Distinguish anonymization, pseudonymity, E2EE and public permanence accurately.
- Never invent external provider capabilities, CI passes or production monitoring.
- No payment or external infrastructure cost without owner authorization.

## Open decisions

License and media rights, domain, Render/Neon credentials and billing, CMS editorial personnel, contact/security channels, and audit/conformance evidence. Choose safe documented engineering defaults, but escalate material product decisions.
