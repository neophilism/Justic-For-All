# Initiative registry — JFA-12

The canonical `config/initiative-registry.v1.json` holds **public-approved informational copy only**. It is versioned and validated; the core package uses it to generate a browseable directory and server-rendered detail pages. Its static visibility is NOT evidence that the underlying initiative application is operational.

## Review and release

- Validate locally with `node scripts/validate-initiative-registry.mjs` and `pnpm test`.
- Public fields are limited to `slug`, `name`, `description`, `overview` and `status`. No identity data, secret, internal connector address, case material, evidence or private contact details belong here.
- The validator rejects `pilot`, `live` and `available` declarations in the static manifest. Promotion requires an independent verified service contract, health, publication approval and rollback path.
- A consumer-visible public API continues to project `slug, name, description, status` only; status is a deliberately conservative public availability label.
- The existing `initiatives` Postgres table and `core_public_initiatives` view remain the server authority for later verified DB-backed publication. JFA-12 creates the reviewed seed path but **does not claim runtime DB data is already in use**.
- The page and API currently use the versioned source file as a conservative pre-deployment preview. Transitioning to live DB/public-view publication requires separate readiness testing.
- The seed command defaults to **dry-run** and needs both `--apply` and `--approve-public-planning-copy`. It is never called by startup, migration or CI implicitly.
- Seed does not overwrite existing lifecycle status, private service references or capabilities. Updating already-reviewed text requires a new reviewed Git change and explicit seed invocation.
- When the dedicated applications eventually launch, publish actual availability and links only after verifying their contracts and public-safe projections.

## Seed command

```sh
pnpm --filter @jfa/db seed:initiatives
# after explicit review and database environment configuration:
pnpm --filter @jfa/db seed:initiatives --apply --approve-public-planning-copy
```

The second command is intentionally not run as part of this PR. No production Neon database is assumed or altered.
