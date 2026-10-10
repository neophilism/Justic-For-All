# JFA-13A — Structured editorial draft foundation

**Scope:** Internal editorial document validation and an authorization-checked, append-only draft revision writer. This is **not** the complete JFA-13 work package.

## Implemented

- A versioned, bounded structured document model for page/article/resource/FAQ entries, plain-text rich runs, lists, headings, citations-as-media-metadata, and no arbitrary HTML.
- Reject unknown keys, oversized content, HTML markup, unsafe media metadata URLs, invalid locale/slug and unsupported entry types.
- Internal-only `createEditorialDraft` repository function writes into the pre-existing `cms_entries`, `cms_revisions` and `audit_events` core schema using parameterized SQL and a DB-level active editor/admin check, in a transaction.
- An unpublished draft never swaps the public `current_revision` of a previously published record. Current public view already requires `visibility='public'` plus `editorial_state='published'`.
- No HTTP authoring route, identity enrollment, new storage provider, dynamic upload, or public preview of drafts is enabled.

## Still required for full JFA-13 acceptance

- Authenticated editor UI with practical field-based rich text editing and WCAG/keyboard review, once JFA-19 sessions and JFA-20 permissions are implemented or an equivalently verified secure admin boundary is established.
- Actual media upload scanning, MIME/type verification, content size limits and safe object storage; current version accepts **metadata only**.
- Real PostgreSQL integration tests for privileged and unauthorized draft transactions, concurrent updates, failure/retry and audit evidence.
- A complete publication workflow under JFA-14 (independent reviewer approval, release, withdrawal, revision/caching guards) before a CMS page can be displayed publicly.
- Verified security evidence under E2EESA with no blanket conformance claim.

Any admin endpoint added later must authenticate the actor independently of user-supplied IDs and fail closed without required authorization. Do not represent a source-controlled validation library as a live CMS.
