-- JFA-05 baseline. PostgreSQL >= 16. Core-owned schema only.
-- Production rollback is by forward-fix or verified restoration, not destructive DROP.
BEGIN;
CREATE TABLE IF NOT EXISTS jfa_schema_migrations (
  version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_state text NOT NULL DEFAULT 'active' CHECK(account_state IN ('invited','active','disabled','deleted')),
  created_at timestamptz NOT NULL DEFAULT now(), disabled_at timestamptz,
  row_version bigint NOT NULL DEFAULT 1 CHECK(row_version > 0)
);

CREATE TABLE IF NOT EXISTS authenticators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id uuid NOT NULL REFERENCES identities(id),
  method text NOT NULL CHECK(method IN ('passkey','email_link','external_provider')),
  credential_ref text NOT NULL, last_used_at timestamptz, revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(identity_id, credential_ref)
);

CREATE TABLE IF NOT EXISTS profiles (
  identity_id uuid PRIMARY KEY REFERENCES identities(id),
  public_display_name text, visibility text NOT NULL DEFAULT 'private' CHECK(visibility IN ('private','public')),
  locale text NOT NULL DEFAULT 'en', accessibility_prefs jsonb NOT NULL DEFAULT '{}'::jsonb,
  row_version bigint NOT NULL DEFAULT 1 CHECK(row_version > 0)
);

CREATE TABLE IF NOT EXISTS contact_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id uuid NOT NULL REFERENCES identities(id),
  purpose text NOT NULL, address_ciphertext bytea NOT NULL CHECK(octet_length(address_ciphertext)>0),
  crypto_key_ref text NOT NULL, verified_at timestamptz,
  retention_state text NOT NULL DEFAULT 'active' CHECK(retention_state IN ('active','suppressed','erasure_pending')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES identities(id),
  role text NOT NULL CHECK(role IN ('admin','editor','reviewer','support','viewer')),
  resource_scope text NOT NULL DEFAULT 'core',
  approved_by uuid REFERENCES identities(id),
  expires_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at IS NULL OR expires_at > created_at)
);

CREATE TABLE IF NOT EXISTS initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE,
  display_name text NOT NULL, public_description text NOT NULL,
  status text NOT NULL DEFAULT 'planning' CHECK(status IN ('concept','planning','building','pilot','live','paused','retired')),
  service_ref text, capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  reviewed_at timestamptz, publication_approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), row_version bigint NOT NULL DEFAULT 1 CHECK(row_version > 0),
  CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), CHECK(jsonb_typeof(capabilities)='array')
);

CREATE TABLE IF NOT EXISTS cms_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type text NOT NULL, slug text NOT NULL, locale text NOT NULL DEFAULT 'en',
  current_revision integer CHECK(current_revision IS NULL OR current_revision>0),
  visibility text NOT NULL DEFAULT 'private' CHECK(visibility IN ('private','public','withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(slug,locale)
);

CREATE TABLE IF NOT EXISTS cms_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES cms_entries(id), version integer NOT NULL CHECK(version>0),
  content jsonb NOT NULL CHECK(jsonb_typeof(content)='object'),
  author_id uuid REFERENCES identities(id),
  editorial_state text NOT NULL DEFAULT 'draft' CHECK(editorial_state IN ('draft','in_review','approved','published','superseded','rejected','withdrawn','temporarily_hidden')),
  content_hash text CHECK(content_hash IS NULL OR content_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entry_id,version)
);

CREATE TABLE IF NOT EXISTS publication_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id uuid NOT NULL REFERENCES cms_revisions(id), approver_id uuid NOT NULL REFERENCES identities(id),
  decision text NOT NULL CHECK(decision IN ('approve','reject','revoke')),
  reason_code text NOT NULL, decided_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_ref text NOT NULL, purpose text NOT NULL, scope text NOT NULL,
  policy_version text NOT NULL, decision text NOT NULL CHECK(decision IN ('grant','withdraw')),
  supersedes_id uuid REFERENCES consent_records(id),
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interest_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_ref text NOT NULL, skill_categories jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(skill_categories)='array'),
  availability text, encrypted_contact_ref text, contact_policy text,
  status text NOT NULL DEFAULT 'unconfirmed' CHECK(status IN ('unconfirmed','confirmed','queued','referred','closed','withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_point_id uuid NOT NULL REFERENCES contact_points(id), topic text NOT NULL,
  confirmation_state text NOT NULL DEFAULT 'pending_verification' CHECK(confirmation_state IN ('pending_verification','active','unsubscribed','suppressed')),
  token_digest bytea, confirmed_at timestamptz, unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), CHECK(confirmation_state <> 'active' OR confirmed_at IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS privacy_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id uuid REFERENCES identities(id), receipt_digest bytea,
  request_type text NOT NULL CHECK(request_type IN ('access','correct','erase','restrict','withdraw_consent')),
  due_at timestamptz, assigned_role text,
  status text NOT NULL DEFAULT 'received' CHECK(status IN ('received','identity_or_authority_checked','scoped','processing','completed','partially_completed','denied','appealed','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(identity_id IS NOT NULL OR receipt_digest IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_ref text NOT NULL, reason_category text NOT NULL,
  reporter_identity_id uuid REFERENCES identities(id),
  review_status text NOT NULL DEFAULT 'received' CHECK(review_status IN ('received','triage','reviewed','closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_ref text NOT NULL, policy_ref text NOT NULL,
  action text NOT NULL CHECK(action IN ('hide','restore','withdraw','restrict','reject')),
  reviewer_ref uuid NOT NULL REFERENCES identities(id), report_id uuid REFERENCES content_reports(id),
  appeal_ref text, reason_code text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS module_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE, base_url text, contract_version text, capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  credential_ref text, verification_state text NOT NULL DEFAULT 'unverified' CHECK(verification_state IN ('unverified','verified','disabled')),
  enabled boolean NOT NULL DEFAULT false, verified_at timestamptz, approved_at timestamptz,
  CHECK(jsonb_typeof(capabilities)='array'),
  CHECK(NOT enabled OR (verification_state='verified' AND verified_at IS NOT NULL AND approved_at IS NOT NULL AND contract_version IS NOT NULL AND base_url LIKE 'https://%'))
);

CREATE TABLE IF NOT EXISTS public_projections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_ref text NOT NULL, source_version text NOT NULL,
  release_state text NOT NULL DEFAULT 'draft' CHECK(release_state IN ('draft','published','withdrawn')),
  safe_fields jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(safe_fields)='object'),
  approved_at timestamptz, published_at timestamptz, last_verified_at timestamptz,
  CHECK(release_state <> 'published' OR (approved_at IS NOT NULL AND published_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS outbox_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, subject_ref text, schema_version text NOT NULL,
  classification text NOT NULL DEFAULT 'approved_public' CHECK(classification='approved_public'),
  public_payload jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(public_payload)='object'),
  delivery_state text NOT NULL DEFAULT 'pending' CHECK(delivery_state IN ('pending','delivering','delivered','failed','dead_letter')),
  attempts integer NOT NULL DEFAULT 0 CHECK(attempts>=0),
  created_at timestamptz NOT NULL DEFAULT now(), next_attempt_at timestamptz
);

CREATE TABLE IF NOT EXISTS audit_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_ref text, action text NOT NULL, resource_ref text,
  policy_result text NOT NULL CHECK(policy_result IN ('allow','deny','unknown')),
  previous_hash text, event_hash text, occurred_at timestamptz NOT NULL DEFAULT now(),
  CHECK(event_hash IS NULL OR event_hash ~ '^[a-f0-9]{64}$')
);

CREATE TABLE IF NOT EXISTS health_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_ref text NOT NULL, checked_at timestamptz NOT NULL, source text NOT NULL,
  result text NOT NULL CHECK(result IN ('healthy','degraded','down','unknown','unverified')),
  freshness_seconds integer NOT NULL CHECK(freshness_seconds>0), evidence_ref text
);

CREATE TABLE IF NOT EXISTS aggregate_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, value numeric NOT NULL, source text NOT NULL, method text NOT NULL,
  window_start timestamptz NOT NULL, window_end timestamptz NOT NULL, observed_at timestamptz NOT NULL,
  CHECK(window_end>window_start), UNIQUE(name,source,window_start,window_end)
);

CREATE INDEX IF NOT EXISTS idx_role_grants_subject ON role_grants(subject_id,expires_at);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_entry ON cms_revisions(entry_id,version DESC);
CREATE INDEX IF NOT EXISTS idx_consent_subject_purpose ON consent_records(subject_ref,purpose,recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_interest_status ON interest_offers(status,created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_state ON subscriptions(confirmation_state);
CREATE INDEX IF NOT EXISTS idx_privacy_requests_status ON privacy_requests(status,due_at);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(review_status,created_at);
CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox_events(delivery_state,next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_health_service_time ON health_observations(service_ref,checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_projections_release ON public_projections(release_state,published_at DESC);

-- Only approved projections enter the public views. Application authorization is still required.
CREATE OR REPLACE VIEW core_public_initiatives AS
  SELECT slug,display_name,public_description,status,reviewed_at
  FROM initiatives WHERE publication_approved_at IS NOT NULL AND status NOT IN ('concept','retired');
CREATE OR REPLACE VIEW core_public_content AS
  SELECT e.slug,e.locale,e.entry_type,r.version,
    r.content->>'title' AS title,r.content->>'summary' AS summary
  FROM cms_entries e JOIN cms_revisions r
    ON r.entry_id=e.id AND r.version=e.current_revision
  WHERE e.visibility='public' AND r.editorial_state='published';

-- Keep append-only metadata immutable. Erasable ciphertext lives in separate controlled tables.
CREATE OR REPLACE FUNCTION jfa_forbid_history_rewrite() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'append-only record cannot be changed: %',TG_TABLE_NAME; END $$;
DROP TRIGGER IF EXISTS cms_revisions_immutable ON cms_revisions;
CREATE TRIGGER cms_revisions_immutable BEFORE UPDATE OR DELETE ON cms_revisions
  FOR EACH ROW EXECUTE FUNCTION jfa_forbid_history_rewrite();
DROP TRIGGER IF EXISTS publication_approvals_immutable ON publication_approvals;
CREATE TRIGGER publication_approvals_immutable BEFORE UPDATE OR DELETE ON publication_approvals
  FOR EACH ROW EXECUTE FUNCTION jfa_forbid_history_rewrite();
DROP TRIGGER IF EXISTS consent_records_immutable ON consent_records;
CREATE TRIGGER consent_records_immutable BEFORE UPDATE OR DELETE ON consent_records
  FOR EACH ROW EXECUTE FUNCTION jfa_forbid_history_rewrite();
DROP TRIGGER IF EXISTS audit_events_immutable ON audit_events;
CREATE TRIGGER audit_events_immutable BEFORE UPDATE OR DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION jfa_forbid_history_rewrite();

INSERT INTO jfa_schema_migrations(version) VALUES ('0001_core') ON CONFLICT(version) DO NOTHING;
COMMIT;
