-- JFA-14: one review workflow per source draft; immutable approval and revision history.
BEGIN;
CREATE TABLE IF NOT EXISTS cms_review_workflows (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 entry_id uuid NOT NULL REFERENCES cms_entries(id),
 source_revision_id uuid NOT NULL UNIQUE REFERENCES cms_revisions(id),
 state text NOT NULL CHECK(state IN ('in_review','approved','rejected','published','withdrawn')),
 row_version integer NOT NULL DEFAULT 2 CHECK(row_version>1),
 high_risk boolean NOT NULL DEFAULT true CHECK(high_risk),
 published_revision_id uuid REFERENCES cms_revisions(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK((state IN ('published','withdrawn'))=(published_revision_id IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_review_active_entry ON cms_review_workflows(entry_id)
 WHERE state IN ('in_review','approved');
CREATE INDEX IF NOT EXISTS idx_cms_review_entry_created ON cms_review_workflows(entry_id,created_at DESC);
INSERT INTO jfa_schema_migrations(version) VALUES ('0003_editorial_workflows') ON CONFLICT(version) DO NOTHING;
COMMIT;
