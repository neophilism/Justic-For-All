# JFA-13 — Structured editorial draft foundation

**Scope:** Internal editorial document validation and an authorization-checked, append-only draft revision writer. This is **not** the complete JFA-13 work package.

## Implemented

- A versioned, bounded structured document model for page/article/resource/FAQ entries, plain-text rich runs, lists, headings, citations-as-media-metadata, and no arbitrary HTML.
- Reject unknown keys, oversized content, HTML markup, unsafe media metadata URLs, invalid locale/slug and unsupported entry types.
- Internal-only `createEditorialDraft` repository function writes into the pre-existing `cms_entries`, `cms_revisions` and `audit_events` core schema using parameterized SQL and a DB-level active editor/admin check, in a transaction.
- An unpublished draft never swaps the public `current_revision` of a previously published record. Current public view already requires `visibility='public'` plus `editorial_state='published'`.
- No HTTP authoring route, identity enrollment, configured storage provider, dynamic upload, or public preview of drafts is enabled.

## Scanned image staging

- `inspectEditorialImage` bounds PNG/JPEG bytes to 10 MiB, checks signatures, declared MIME and PNG dimensions, and computes a SHA-256 digest. It rejects SVG, HTML, unknown formats and trailing bytes after the expected image terminator. This preflight is not a malware scanner.
- `createEditorialImage` requires a scanner that explicitly reports a clean verdict and its scanner ID, a private object-store adapter, and a trusted actor ID. It rechecks active editor/admin authorization in PostgreSQL, stores a non-public object, inserts private asset metadata and audit evidence in one database transaction. If an earlier step fails, it attempts to remove the staged object. An ambiguous commit is never compensated blindly.
- The new `0002_editorial_media.sql` migration defines private asset metadata. Uploaded asset references are accepted only for images and only when the draft writer finds a clean asset owned by the editor. Existing external HTTPS references remain metadata only and are not fetched or embedded by preview.
- No object-store provider or scanner is provisioned here. The upload service is internal and cannot be reached from a public route. The protected CI workflow cannot be edited by this lease, so its database job does not yet run migration 0002 or the accompanying SQL test.

## Still required for full JFA-13 acceptance

- Authenticated editor UI with practical field-based rich text editing and WCAG/keyboard review, once JFA-19 sessions and JFA-20 permissions are implemented or an equivalently verified secure admin boundary is established.
- Configure and validate a real malware scanner and durable private object storage; connect them through an authenticated staff upload endpoint. Until then the intake contract is inert and no upload is exposed.
- Real PostgreSQL integration tests for privileged and unauthorized draft/upload transactions, concurrent updates, storage failure/retry and audit evidence. Owner authorization is needed to update the protected CI workflow to apply migration 0002 and run its SQL test.
- A complete publication workflow under JFA-14 (independent reviewer approval, release, withdrawal, revision/caching guards) before a CMS page can be displayed publicly.
- Verified security evidence under E2EESA with no blanket conformance claim.

Any admin endpoint added later must authenticate the actor independently of user-supplied IDs and fail closed without required authorization. Do not represent a source-controlled validation library as a live CMS.
