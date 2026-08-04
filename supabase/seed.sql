-- Seed Data for Phase 3 Demo Property & 360° Tours

INSERT INTO profiles (id, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, title, slug, price, bhk, address, city, status, cover_image)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Luxury 2BHK Penthouse with Ocean Views',
  'luxury-2bhk-penthouse',
  18500000,
  2,
  '742 Skyline Boulevard, Bandra West',
  'Mumbai',
  'published',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO NOTHING;

-- Demo Tour
INSERT INTO tours (id, property_id, status, created_by)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'published',
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- Link tour to property
UPDATE properties 
SET tour_id = '22222222-2222-2222-2222-222222222222'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Scene 1: Living Room
INSERT INTO tour_scenes (id, tour_id, name, sort_order, pano_original_path, pano_levels, initial_yaw, initial_pitch)
VALUES (
  '33333333-3333-3333-3333-333333333331',
  '22222222-2222-2222-2222-222222222222',
  'Living Room',
  0,
  'demo-living-room.webp',
  '{"preview": "/demo-panoramas/living-room.jpg", "low": "/demo-panoramas/living-room.jpg", "med": "/demo-panoramas/living-room.jpg", "high": "/demo-panoramas/living-room.jpg"}',
  0,
  0
) ON CONFLICT (tour_id, sort_order) DO NOTHING;

-- Scene 2: Kitchen
INSERT INTO tour_scenes (id, tour_id, name, sort_order, pano_original_path, pano_levels, initial_yaw, initial_pitch)
VALUES (
  '33333333-3333-3333-3333-333333333332',
  '22222222-2222-2222-2222-222222222222',
  'Gourmet Kitchen',
  1,
  'demo-kitchen.webp',
  '{"preview": "/demo-panoramas/kitchen.jpg", "low": "/demo-panoramas/kitchen.jpg", "med": "/demo-panoramas/kitchen.jpg", "high": "/demo-panoramas/kitchen.jpg"}',
  0.785,
  0
) ON CONFLICT (tour_id, sort_order) DO NOTHING;

-- Scene 3: Master Bedroom
INSERT INTO tour_scenes (id, tour_id, name, sort_order, pano_original_path, pano_levels, initial_yaw, initial_pitch)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Master Bedroom',
  2,
  'demo-bedroom.webp',
  '{"preview": "/demo-panoramas/bedroom.jpg", "low": "/demo-panoramas/bedroom.jpg", "med": "/demo-panoramas/bedroom.jpg", "high": "/demo-panoramas/bedroom.jpg"}',
  1.57,
  0
) ON CONFLICT (tour_id, sort_order) DO NOTHING;

-- Update start scene
UPDATE tours 
SET start_scene_id = '33333333-3333-3333-3333-333333333331'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Hotspots linking scenes
-- Living Room -> Kitchen
INSERT INTO tour_hotspots (id, scene_id, type, yaw, pitch, target_scene_id, title)
VALUES (
  '44444444-4444-4444-4444-444444444441',
  '33333333-3333-3333-3333-333333333331',
  'nav',
  1.57,
  -0.1,
  '33333333-3333-3333-3333-333333333332',
  'Walk to Kitchen'
) ON CONFLICT (id) DO NOTHING;

-- Kitchen -> Living Room
INSERT INTO tour_hotspots (id, scene_id, type, yaw, pitch, target_scene_id, title)
VALUES (
  '44444444-4444-4444-4444-444444444442',
  '33333333-3333-3333-3333-333333333332',
  'nav',
  3.14,
  0,
  '33333333-3333-3333-3333-333333333331',
  'Back to Living Room'
) ON CONFLICT (id) DO NOTHING;

-- Kitchen -> Master Bedroom
INSERT INTO tour_hotspots (id, scene_id, type, yaw, pitch, target_scene_id, title)
VALUES (
  '44444444-4444-4444-4444-444444444443',
  '33333333-3333-3333-3333-333333333332',
  'nav',
  0.785,
  0.1,
  '33333333-3333-3333-3333-333333333333',
  'Upstairs Bedroom'
) ON CONFLICT (id) DO NOTHING;

-- Master Bedroom -> Living Room
INSERT INTO tour_hotspots (id, scene_id, type, yaw, pitch, target_scene_id, title)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'nav',
  -1.57,
  0,
  '33333333-3333-3333-3333-333333333331',
  'Return to Living Room'
) ON CONFLICT (id) DO NOTHING;

-- Info Hotspot in Living Room
INSERT INTO tour_hotspots (id, scene_id, type, yaw, pitch, title, body, icon)
VALUES (
  '44444444-4444-4444-4444-444444444445',
  '33333333-3333-3333-3333-333333333331',
  'info',
  -0.5,
  0.2,
  'Italian Marble Flooring',
  'Imported Botticino Classico marble with soft underfloor heating.',
  'info'
) ON CONFLICT (id) DO NOTHING;
