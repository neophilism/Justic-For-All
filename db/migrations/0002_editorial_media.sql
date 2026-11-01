-- Private scanned editorial assets. No public view or URL is created here.
BEGIN;
CREATE TABLE IF NOT EXISTS cms_media_assets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 uploaded_by uuid NOT NULL REFERENCES identities(id),
 object_key text NOT NULL UNIQUE,
 mime_type text NOT NULL CHECK(mime_type IN ('image/png','image/jpeg')),
 byte_size integer NOT NULL CHECK(byte_size BETWEEN 24 AND 10485760),
 sha256 text NOT NULL CHECK(sha256 ~ '^[a-f0-9]{64}$'),
 scanner_id text NOT NULL CHECK(length(scanner_id) BETWEEN 3 AND 120),
 scan_state text NOT NULL DEFAULT 'clean' CHECK(scan_state='clean'),
 scanned_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cms_media_assets_owner ON cms_media_assets(uploaded_by,created_at DESC);
INSERT INTO jfa_schema_migrations(version) VALUES ('0002_editorial_media') ON CONFLICT(version) DO NOTHING;
COMMIT;
