-- ==============================================================================
-- POSTGIS SPATIAL SEARCH: nearby_properties
-- Stage 2 / Step H: PostGIS Radial Proximity Query
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.nearby_properties(
  target_lat double precision,
  target_lng double precision,
  radius_km double precision DEFAULT 15,
  bhk_filter text DEFAULT 'all'
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  price bigint,
  bhk integer,
  address text,
  city text,
  locality text,
  status text,
  cover_image text,
  tour_id uuid,
  external_tour_url text,
  external_tour_provider text,
  description text,
  featured boolean,
  lat double precision,
  lng double precision,
  dist_meters double precision
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.price,
    p.bhk,
    p.address,
    p.city,
    p.locality,
    p.status,
    p.cover_image,
    p.tour_id,
    p.external_tour_url,
    p.external_tour_provider,
    p.description,
    p.featured,
    p.lat,
    p.lng,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography
    ) AS dist_meters
  FROM public.properties p
  WHERE p.status = 'published'
    AND (bhk_filter = 'all' OR p.bhk = bhk_filter::integer)
    AND (
      p.location IS NOT NULL AND
      ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography,
        radius_km * 1000
      )
    )
  ORDER BY dist_meters ASC;
$$;

GRANT EXECUTE ON FUNCTION public.nearby_properties(double precision, double precision, double precision, text) TO anon, authenticated, service_role;
