-- ==============================================================================
-- EXTERNAL 360° TOUR LINKS MIGRATION
-- Support Panocool, Kuula, Matterport, etc.
-- ==============================================================================

alter table properties
  add column if not exists external_tour_url text,
  add column if not exists external_tour_provider text;
