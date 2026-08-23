-- 0004_media_assets_course_id_index
-- Ledger-reconciliation migration.
--
-- The covering index media_assets_course_id_idx was created ad-hoc (via the
-- Supabase advisor performance fix) after 0003, so production DDL had drifted
-- ahead of the recorded migration ledger, which still ended at 0003. This
-- migration records that index as 0004 so the ledger is truthful again.
--
-- It is fully idempotent (CREATE INDEX IF NOT EXISTS): re-applying it against a
-- database that already has the index is a no-op. It contains this single
-- statement and nothing else. The previously drafted localized-ebook-covers
-- schema was determined unnecessary (media_assets.course_id + language_code +
-- mime_type already models localized, multi-format covers) and is preserved,
-- unapplied, at supabase/migrations/shelved/0004_localized_ebook_covers.sql.
--
-- Rollback:
--   drop index if exists public.media_assets_course_id_idx;

create index if not exists media_assets_course_id_idx on public.media_assets (course_id);
