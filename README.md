# Justice For All — Core Platform

The shared public website, initiative directory, editorial experience, consent boundaries and integration shell for **Justice For All**.

**Status:** foundation work in progress. The website is **not deployed**, no private-submission workflow is available, and downstream initiative services must be verified independently.

## Start here

- [Complete independent-agent development plan](docs/DEVELOPMENT_PLAN.md) — authoritative 50-work-package scope and acceptance gates.
- [Architecture and repository boundaries](docs/ARCHITECTURE.md)
- [Roadmap and evidence](docs/ROADMAP.md)
- [Engine Room project registration](.exechub/project.yml)
- [Contributing and security](CONTRIBUTING.md)

## Local development

Use Node.js 22.16.0 (see `.node-version`), Corepack and pinned pnpm 10.18.3. Run:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm check
corepack pnpm dev
```

The only Next.js server is `apps/web`. A local PostgreSQL + mail-catcher development environment is described in [docs/DEV_SETUP.md](docs/DEV_SETUP.md). Packages `core`, `contracts`, `ui`, `adapters`, `security` and a disabled `apps/worker` provide clear workspace boundaries. The workspace now pins a reviewed lockfile; this does not establish production security certification.

## Critical boundaries

This repository is the **core portal**, not a replacement for testimony intake, FOIA filing, distributed archival storage, case management, or the reusable civic engines. Never collect confidential testimony through a generic website form; route it to a verified dedicated protected service when that service is actually available.

Public reading must not require an account. Operational features must be explicitly labeled unavailable until a tested deployment exists. Respect consent, attribution, content review, anonymity limitations and retraction.

Security references [E2EESA](https://github.com/neophilism/End-To-End-Everywhere-Security-Architecture-Standard); conformance or production security **has not been certified**.

## Project tracking

The approved roadmap contains 50 **planned work packages**, not 50 completed GitHub PRs. Engine Room progress must map each work-package ID to a real merged pull request and must separately report live deployment/health.

The GitHub repository slug is deliberately preserved as `Justic-For-All` to match the repository supplied by the project owner.

## End-to-End Everywhere progress

The canonical [security/e2eesa-status.json](security/e2eesa-status.json) records standard implementation, complete testing and independent expert review separately. Engine Room reads it automatically from GitHub. All initial stages are pending; existing profile locks and approved decisions remain authoritative. Read [adoption and independent-account instructions](docs/E2EESA_ADOPTION.md), and run `python3 scripts/validate_e2eesa_status.py`. Record validation does not establish product security or certification.
