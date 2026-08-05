import { createClient as createServerClient } from './server';
import { createClient as createBrowserClient } from './client';
import { PropertyData, TourData, TourScene, TourHotspot, DEMO_PROPERTIES_LIST, DEMO_PROPERTY, DEMO_TOUR } from '@/lib/mock-data';

function getSupabase(isServer: boolean = typeof window === 'undefined') {
  return isServer ? createServerClient() : createBrowserClient();
}

/**
 * Fetch all published properties from Supabase
 */
export async function getPublishedProperties(): Promise<PropertyData[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching published properties from Supabase:', error.message);
      return DEMO_PROPERTIES_LIST.filter((p) => p.status === 'published');
    }

    if (data && data.length > 0) {
      return data as PropertyData[];
    }
  } catch (err) {
    console.warn('Fallback to mock properties due to fetch error:', err);
  }

  return DEMO_PROPERTIES_LIST.filter((p) => p.status === 'published');
}

/**
 * Fetch featured published properties for the homepage
 */
export async function getFeaturedProperties(): Promise<PropertyData[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching featured properties from Supabase:', error.message);
      return DEMO_PROPERTIES_LIST.filter((p) => p.status === 'published' && p.featured);
    }

    if (data && data.length > 0) {
      return data as PropertyData[];
    }
  } catch (err) {
    console.warn('Fallback to mock featured properties:', err);
  }

  return DEMO_PROPERTIES_LIST.filter((p) => p.status === 'published' && p.featured);
}

/**
 * Fetch a single property by its slug
 */
export async function getPropertyBySlug(slug: string): Promise<PropertyData | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.warn(`Error fetching property for slug "${slug}":`, error.message);
      const fallback = DEMO_PROPERTIES_LIST.find((p) => p.slug === slug);
      return fallback || null;
    }

    return (data as PropertyData) || null;
  } catch (err) {
    console.warn(`Fallback property lookup for slug "${slug}":`, err);
    return DEMO_PROPERTIES_LIST.find((p) => p.slug === slug) || null;
  }
}

/**
 * Fetch complete 360° Tour data including scenes and hotspots by tour ID
 */
export async function getTourById(tourId: string): Promise<TourData | null> {
  try {
    const supabase = getSupabase();
    
    // 1. Fetch tour metadata
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', tourId)
      .single();

    if (tourError || !tour) {
      console.warn(`Error fetching tour ${tourId}:`, tourError?.message);
      return DEMO_TOUR;
    }

    // 2. Fetch tour scenes
    const { data: scenes, error: scenesError } = await supabase
      .from('tour_scenes')
      .select('*')
      .eq('tour_id', tourId)
      .order('sort_order', { ascending: true });

    if (scenesError || !scenes || scenes.length === 0) {
      return DEMO_TOUR;
    }

    // 3. Fetch tour hotspots for all scenes in this tour
    const sceneIds = scenes.map((s) => s.id);
    const { data: hotspots } = await supabase
      .from('tour_hotspots')
      .select('*')
      .in('scene_id', sceneIds);

    const formattedHotspots: TourHotspot[] = (hotspots || []).map((h) => ({
      id: h.id,
      sceneId: h.scene_id,
      type: h.type,
      yaw: h.yaw,
      pitch: h.pitch,
      targetSceneId: h.target_scene_id,
      title: h.title,
      body: h.body,
      icon: h.icon,
    }));

    return {
      id: tour.id,
      property_id: tour.property_id,
      start_scene_id: tour.start_scene_id || scenes[0].id,
      status: tour.status,
      tour_scenes: scenes as TourScene[],
      tour_hotspots: formattedHotspots,
    };
  } catch (err) {
    console.warn(`Fallback tour query for tour ${tourId}:`, err);
    return DEMO_TOUR;
  }
}

/**
 * Search properties using PostGIS radial proximity or city fallback
 */
export async function searchNearbyProperties(options: {
  lat?: number | null;
  lng?: number | null;
  radiusKm?: number;
  bhk?: string;
  city?: string | null;
  query?: string;
}): Promise<PropertyData[]> {
  const { lat, lng, radiusKm = 15, bhk = 'all', city, query } = options;
  const supabase = getSupabase();

  try {
    if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
      const { data, error } = await supabase.rpc('nearby_properties', {
        target_lat: lat,
        target_lng: lng,
        radius_km: radiusKm,
        bhk_filter: bhk,
      });

      if (!error && data) {
        let results = data as PropertyData[];
        if (query && query.trim()) {
          const q = query.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.address.toLowerCase().includes(q) ||
              p.city.toLowerCase().includes(q)
          );
        }
        return results;
      }
    }

    // Fallback if coordinates are not available or RPC not deployed
    let dbQuery = supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (bhk && bhk !== 'all') {
      dbQuery = dbQuery.eq('bhk', parseInt(bhk, 10));
    }
    if (city && city !== 'All Cities') {
      dbQuery = dbQuery.ilike('city', `%${city}%`);
    }

    const { data: fallbackData, error: fallbackError } = await dbQuery;

    if (!fallbackError && fallbackData) {
      let results = fallbackData as PropertyData[];
      if (query && query.trim()) {
        const q = query.toLowerCase();
        results = results.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q)
        );
      }
      return results;
    }
  } catch (err) {
    console.warn('Error in searchNearbyProperties:', err);
  }

  // Fallback to in-memory filter of demo/cached properties
  return DEMO_PROPERTIES_LIST.filter((p) => {
    if (p.status !== 'published') return false;
    if (bhk !== 'all' && p.bhk.toString() !== bhk) return false;
    if (city && city !== 'All Cities' && p.city.toLowerCase() !== city.toLowerCase()) return false;
    if (query && query.trim()) {
      const q = query.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return true;
  });
}
