-- PHASE 3: 360° TOUR ENGINE MIGRATIONS
-- Database additions for Madco Estates Virtual Walkthroughs

-- 1. Profiles Table (if not existing)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  role text DEFAULT 'user',
  created_at timestamp DEFAULT now()
);

-- 2. Properties Table (if not existing)
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric NOT NULL,
  bhk int DEFAULT 2,
  address text,
  city text,
  status text CHECK (status IN ('draft', 'published')) DEFAULT 'published',
  cover_image text,
  tour_id uuid,
  created_at timestamp DEFAULT now()
);

-- 3. Tours Table
CREATE TABLE IF NOT EXISTS tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  start_scene_id uuid,
  status text CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  created_by uuid REFERENCES profiles(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 4. Tour Scenes Table
CREATE TABLE IF NOT EXISTS tour_scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order int DEFAULT 0,
  pano_original_path text,
  pano_levels jsonb DEFAULT '{"preview": null, "low": null, "med": null, "high": null}',
  initial_yaw float DEFAULT 0,
  initial_pitch float DEFAULT 0,
  initial_zoom float DEFAULT 1,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(tour_id, sort_order)
);

-- 5. Tour Hotspots Table
CREATE TABLE IF NOT EXISTS tour_hotspots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id uuid NOT NULL REFERENCES tour_scenes(id) ON DELETE CASCADE,
  type text CHECK (type IN ('nav', 'info')) NOT NULL,
  yaw float NOT NULL,
  pitch float NOT NULL,
  target_scene_id uuid REFERENCES tour_scenes(id) ON DELETE SET NULL,
  title text,
  body text,
  icon text,
  created_at timestamp DEFAULT now()
);

-- 6. Events Tracking Table
CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  type text NOT NULL,
  property_id uuid REFERENCES properties(id),
  user_id uuid REFERENCES profiles(id),
  session_id text,
  meta jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_type_property ON events(type, property_id);
CREATE INDEX IF NOT EXISTS idx_events_property ON events(property_id);

-- 7. Vercel Blob Metadata Table
CREATE TABLE IF NOT EXISTS blob_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id),
  tour_scene_id uuid REFERENCES tour_scenes(id),
  blob_url text NOT NULL,
  level text,
  size_bytes bigint,
  created_at timestamp DEFAULT now()
);

-- Foreign Key Additions
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tour_id uuid REFERENCES tours(id) ON DELETE SET NULL;
