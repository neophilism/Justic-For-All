# Contributing

The canonical requirements and roadmap are in [docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

1. Work in short branches named for the real planned work package (`jfa-01-...`) and open a reviewed PR.
2. Preserve one source of truth per data class. Do not place confidential testimony, evidence, or case data in this public repository or generic intake forms.
3. Before requesting merge, run `corepack pnpm install --frozen-lockfile && corepack pnpm check` from the repository root. Install uses the source-controlled frozen pnpm lockfile.
4. Document negative-path tests, security and accessibility implications, migration handling and versioned integration contracts.
5. Add verified evidence to [docs/ACCEPTANCE_EVIDENCE.md](docs/ACCEPTANCE_EVIDENCE.md). Never use planned PR IDs as if they were GitHub PR numbers or infer success from a commit alone.
6. Link the actual GitHub PR in the work-package mapping only after it merges and its checks succeed.

For vulnerabilities or privacy incidents, read [SECURITY.md](SECURITY.md) before sharing sensitive details. Do not post secrets or private allegations in public issues.

## Development practices

- Explicit dependencies and tightly bounded imports between independently deployed services.
- Small changes with reproducible tests. Code changes require an explanation of how to verify them.
- Accessible, responsive, mobile-first public pages; reduced-motion and keyboard support.
- In particular, no unreviewed automatic publication of externally submitted material.
