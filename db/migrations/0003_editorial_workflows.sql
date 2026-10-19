-- JFA-14: one review workflow per source draft; immutable approval and revision history.
BEGIN;
ALTER TABLE publication_approvals ADD COLUMN IF NOT EXISTS decision_order bigint GENERATED ALWAYS AS IDENTITY;
CREATE UNIQUE INDEX IF NOT EXISTS idx_publication_decision_order ON publication_approvals(decision_order);
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
-- Fail closed if a privileged caller bypasses the application service.
CREATE OR REPLACE FUNCTION jfa_guard_published_revision() RETURNS trigger
LANGUAGE plpgsql AS $jfa$
DECLARE source_row cms_revisions%ROWTYPE; approval_count integer; invalid_count integer;
BEGIN
 IF NEW.editorial_state<>'published' THEN RETURN NEW; END IF;
 SELECT r.* INTO source_row FROM cms_review_workflows w
 JOIN cms_revisions r ON r.id=w.source_revision_id
 WHERE w.entry_id=NEW.entry_id AND w.state='approved' AND r.version=NEW.version-1
 ORDER BY w.created_at DESC LIMIT 1;
 IF NOT FOUND OR source_row.editorial_state<>'draft' OR NEW.author_id IS DISTINCT FROM source_row.author_id
   OR NEW.content IS DISTINCT FROM source_row.content
   OR NEW.content_hash IS DISTINCT FROM source_row.content_hash THEN
  RAISE EXCEPTION 'published revision lacks approved immutable draft';
 END IF;
 SELECT count(*) FILTER (WHERE p.decision='approve'),
  count(*) FILTER (WHERE p.decision='approve' AND p.approver_id=source_row.author_id)
 INTO approval_count,invalid_count FROM (
  SELECT DISTINCT ON (approver_id) approver_id,decision
  FROM publication_approvals WHERE revision_id=source_row.id
  ORDER BY approver_id,decision_order DESC
 ) p;
 IF approval_count<2 OR invalid_count>0 THEN
  RAISE EXCEPTION 'published revision requires two independent approvals';
 END IF;
 RETURN NEW;
END $jfa$;
DROP TRIGGER IF EXISTS cms_published_revision_guard ON cms_revisions;
CREATE TRIGGER cms_published_revision_guard BEFORE INSERT ON cms_revisions
 FOR EACH ROW EXECUTE FUNCTION jfa_guard_published_revision();
INSERT INTO jfa_schema_migrations(version) VALUES ('0003_editorial_workflows') ON CONFLICT(version) DO NOTHING;
COMMIT;
