-- ==============================================================================
-- MADCO ESTATES — SEED DATA
-- Stage 2 / Step E: Real Database Rows for Listings, 360° Tours, Scenes & Hotspots
-- ==============================================================================

-- 0. Ensure handle_new_user trigger function is fully qualified and robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, avatar_url, role, is_owner)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.phone,
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'buyer'::public.user_role),
    COALESCE((new.raw_user_meta_data->>'is_owner')::boolean, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  RETURN new;
END;
$$;

-- 1. SEED PROPERTIES
INSERT INTO public.properties (
  id,
  title,
  slug,
  price,
  bhk,
  address,
  city,
  locality,
  status,
  cover_image,
  description,
  featured,
  lat,
  lng,
  location
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Luxury 2BHK Penthouse with Ocean Views',
  'luxury-2bhk-penthouse',
  18500000,
  2,
  '742 Skyline Boulevard, Bandra West',
  'Mumbai',
  'Bandra West',
  'published',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'Experience elevated coastal living in this masterfully designed 2BHK luxury penthouse featuring panoramic Arabian Sea vistas, designer brass accents, and full 360° interactive virtual walkthrough capabilities.',
  true,
  19.0596,
  72.8295,
  ST_SetSRID(ST_MakePoint(72.8295, 19.0596), 4326)::geography
),
(
  '11111111-1111-1111-1111-111111111112',
  'Modern 3BHK Garden Villa',
  'modern-3bhk-garden-villa',
  32000000,
  3,
  '12 Palm Grove Avenue, Juhu',
  'Mumbai',
  'Juhu',
  'published',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'Contemporary multi-level garden villa with private infinity plunge pool, floor-to-ceiling glass facades, and automated smart lighting.',
  true,
  19.1075,
  72.8263,
  ST_SetSRID(ST_MakePoint(72.8263, 19.1075), 4326)::geography
),
(
  '11111111-1111-1111-1111-111111111113',
  'Seaside Duplex Suite',
  'seaside-duplex-suite',
  24500000,
  3,
  '88 Carter Road, Bandra West',
  'Mumbai',
  'Bandra West',
  'published',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'Breathtaking duplex suite under owner verification and Mad.co 360° capture review.',
  false,
  19.0657,
  72.8238,
  ST_SetSRID(ST_MakePoint(72.8238, 19.0657), 4326)::geography
),
(
  '11111111-1111-1111-1111-111111111114',
  'The Azure Seafront 4BHK Sky Villa',
  'azure-seafront-sky-villa',
  18500000,
  4,
  'Sultan Battery Road, Urwa',
  'Mangalore',
  'Urwa',
  'published',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'Unobstructed 270-degree view of Arabian Sea & Gurupura River confluence. Features 11-ft floor-to-ceiling soundproof glass facades, imported Italian marble flooring, and 360° Matterport spatial mapping.',
  true,
  12.8943,
  74.8322,
  ST_SetSRID(ST_MakePoint(74.8322, 12.8943), 4326)::geography
),
(
  '11111111-1111-1111-1111-111111111115',
  'Kadri Presidential 3BHK Penthouse',
  'kadri-presidential-penthouse',
  14500000,
  3,
  'Airport Road, Kadri',
  'Mangalore',
  'Kadri',
  'published',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'Panoramic Kadri Hills park view penthouse with wrap-around balconies, private sky garden, and smart home automation.',
  true,
  12.8797,
  74.8560,
  ST_SetSRID(ST_MakePoint(74.8560, 12.8797), 4326)::geography
),
(
  '11111111-1111-1111-1111-111111111116',
  'Surathkal Beachfront Luxury Villa',
  'surathkal-beachfront-villa',
  21000000,
  4,
  'Surathkal Beach Road',
  'Mangalore',
  'Surathkal',
  'published',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'Private direct beach access villa with sunset decks, landscaped coconut grove gardens, and full 360° walkthrough.',
  true,
  13.0068,
  74.7954,
  ST_SetSRID(ST_MakePoint(74.7954, 13.0068), 4326)::geography
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  bhk = EXCLUDED.bhk,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  locality = EXCLUDED.locality,
  status = EXCLUDED.status,
  cover_image = EXCLUDED.cover_image,
  description = EXCLUDED.description,
  featured = EXCLUDED.featured,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  location = EXCLUDED.location;

-- 2. SEED 360° TOURS
INSERT INTO public.tours (
  id,
  property_id,
  status
) VALUES
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'published'
),
(
  '22222222-2222-2222-2222-222222222223',
  '11111111-1111-1111-1111-111111111114',
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  property_id = EXCLUDED.property_id,
  status = EXCLUDED.status;

-- Link tours back to properties
UPDATE public.properties SET tour_id = '22222222-2222-2222-2222-222222222222' WHERE id IN ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111113');
UPDATE public.properties SET tour_id = '22222222-2222-2222-2222-222222222223' WHERE id IN ('11111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111116');

-- 3. SEED TOUR SCENES
INSERT INTO public.tour_scenes (
  id,
  tour_id,
  name,
  sort_order,
  pano_original_path,
  pano_levels,
  initial_yaw,
  initial_pitch,
  initial_zoom
) VALUES
(
  '33333333-3333-3333-3333-333333333331',
  '22222222-2222-2222-2222-222222222222',
  'Grand Living Room',
  0,
  'demo-living-room.webp',
  '{"preview": "/demo-panoramas/living-room.jpg", "low": "/demo-panoramas/living-room.jpg", "med": "/demo-panoramas/living-room.jpg", "high": "/demo-panoramas/living-room.jpg"}'::jsonb,
  0,
  0,
  1
),
(
  '33333333-3333-3333-3333-333333333332',
  '22222222-2222-2222-2222-222222222222',
  'Gourmet Kitchen',
  1,
  'demo-kitchen.webp',
  '{"preview": "/demo-panoramas/kitchen.jpg", "low": "/demo-panoramas/kitchen.jpg", "med": "/demo-panoramas/kitchen.jpg", "high": "/demo-panoramas/kitchen.jpg"}'::jsonb,
  0.785,
  0,
  1
),
(
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Master Bedroom Suite',
  2,
  'demo-bedroom.webp',
  '{"preview": "/demo-panoramas/bedroom.jpg", "low": "/demo-panoramas/bedroom.jpg", "med": "/demo-panoramas/bedroom.jpg", "high": "/demo-panoramas/bedroom.jpg"}'::jsonb,
  1.57,
  0,
  1
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  pano_levels = EXCLUDED.pano_levels,
  initial_yaw = EXCLUDED.initial_yaw,
  initial_pitch = EXCLUDED.initial_pitch;

-- Update tour start scene
UPDATE public.tours
SET start_scene_id = '33333333-3333-3333-3333-333333333331'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- 4. SEED TOUR HOTSPOTS
INSERT INTO public.tour_hotspots (
  id,
  scene_id,
  type,
  yaw,
  pitch,
  target_scene_id,
  title,
  body,
  icon
) VALUES
(
  '44444444-4444-4444-4444-444444444441',
  '33333333-3333-3333-3333-333333333331',
  'nav',
  1.57,
  -0.05,
  '33333333-3333-3333-3333-333333333332',
  'Walk to Gourmet Kitchen',
  null,
  null
),
(
  '44444444-4444-4444-4444-444444444442',
  '33333333-3333-3333-3333-333333333332',
  'nav',
  3.14,
  0,
  '33333333-3333-3333-3333-333333333331',
  'Back to Living Room',
  null,
  null
),
(
  '44444444-4444-4444-4444-444444444443',
  '33333333-3333-3333-3333-333333333332',
  'nav',
  0.785,
  0.05,
  '33333333-3333-3333-3333-333333333333',
  'Enter Master Bedroom',
  null,
  null
),
(
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'nav',
  -1.57,
  0,
  '33333333-3333-3333-3333-333333333331',
  'Return to Living Room',
  null,
  null
),
(
  '44444444-4444-4444-4444-444444444445',
  '33333333-3333-3333-3333-333333333331',
  'info',
  -0.5,
  0.15,
  null,
  'Italian Botticino Marble',
  'Custom honed Botticino Classico Italian marble slabs with underfloor heating.',
  'info'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  yaw = EXCLUDED.yaw,
  pitch = EXCLUDED.pitch;

-- 5. SEED SAMPLE ENQUIRIES
INSERT INTO public.enquiries (
  id,
  property_id,
  visitor_name,
  visitor_phone,
  visitor_email,
  message,
  status
) VALUES
(
  '55555555-5555-5555-5555-555555555551',
  '11111111-1111-1111-1111-111111111111',
  'Priya Sharma',
  '+91 98111 44556',
  'priya.sharma@example.com',
  'I completed the 360° tour and would like to schedule a private in-person viewing this Saturday.',
  'new'
),
(
  '55555555-5555-5555-5555-555555555552',
  '11111111-1111-1111-1111-111111111111',
  'Anand Verma',
  '+91 97654 32109',
  'anand.verma@example.com',
  'Interested in payment terms and maintenance costs for this penthouse.',
  'contacted'
)
ON CONFLICT (id) DO UPDATE SET
  message = EXCLUDED.message,
  status = EXCLUDED.status;
