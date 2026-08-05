'use server';

import { createClient } from '@/lib/supabase/server';
import { TourHotspot, TourData, TourScene } from '@/lib/mock-data';

export async function fetchTourForBuilderAction(tourId: string): Promise<TourData | null> {
  try {
    const supabase = createClient();

    const { data: tour, error: tourErr } = await supabase
      .from('tours')
      .select('*')
      .eq('id', tourId)
      .single();

    if (tourErr || !tour) {
      return null;
    }

    const { data: scenesData } = await supabase
      .from('tour_scenes')
      .select('*')
      .eq('tour_id', tourId)
      .order('sort_order', { ascending: true });

    const scenes: TourScene[] = (scenesData || []).map((sc: any) => ({
      id: sc.id,
      name: sc.name,
      sort_order: sc.sort_order,
      pano_levels: {
        preview: sc.preview_url || sc.equirectangular_url || '/panos/preview.jpg',
        low: sc.low_url || sc.equirectangular_url || '/panos/low.jpg',
        med: sc.med_url || sc.equirectangular_url || '/panos/med.jpg',
        high: sc.high_url || sc.equirectangular_url || '/panos/high.jpg',
      },
      initial_yaw: Number(sc.initial_yaw || 0),
      initial_pitch: Number(sc.initial_pitch || 0),
      initial_zoom: Number(sc.initial_zoom || 1.0),
    }));

    let hotspots: TourHotspot[] = [];
    if (scenes.length > 0) {
      const sceneIds = scenes.map((s) => s.id);
      const { data: hotspotsData } = await supabase
        .from('tour_hotspots')
        .select('*')
        .in('scene_id', sceneIds);

      if (hotspotsData) {
        hotspots = hotspotsData.map((h: any) => ({
          id: h.id,
          sceneId: h.scene_id,
          type: h.type,
          yaw: Number(h.yaw),
          pitch: Number(h.pitch),
          targetSceneId: h.target_scene_id,
          title: h.title,
          body: h.body,
          icon: h.icon,
        }));
      }
    }

    return {
      id: tour.id,
      property_id: tour.property_id,
      start_scene_id: tour.start_scene_id || scenes[0]?.id || '',
      status: tour.status,
      tour_scenes: scenes as TourScene[],
      tour_hotspots: hotspots,
    };
  } catch (err) {
    console.error('Error fetching tour for builder:', err);
    return null;
  }
}

export async function saveTourHotspotAction(hotspot: {
  id?: string;
  sceneId: string;
  type: 'nav' | 'info';
  yaw: number;
  pitch: number;
  targetSceneId?: string;
  title: string;
  body?: string;
}): Promise<{ success: boolean; hotspot?: TourHotspot; error?: string }> {
  try {
    const supabase = createClient();

    const hotspotId = hotspot.id || crypto.randomUUID();

    const payload = {
      id: hotspotId,
      scene_id: hotspot.sceneId,
      type: hotspot.type,
      yaw: hotspot.yaw,
      pitch: hotspot.pitch,
      target_scene_id: hotspot.type === 'nav' && hotspot.targetSceneId ? hotspot.targetSceneId : null,
      title: hotspot.title,
      body: hotspot.type === 'info' && hotspot.body ? hotspot.body : null,
    };

    const { data, error } = await supabase
      .from('tour_hotspots')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error saving tour hotspot:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      hotspot: {
        id: data.id,
        sceneId: data.scene_id,
        type: data.type,
        yaw: Number(data.yaw),
        pitch: Number(data.pitch),
        targetSceneId: data.target_scene_id,
        title: data.title,
        body: data.body,
      },
    };
  } catch (err: any) {
    console.error('Save hotspot error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteTourHotspotAction(
  hotspotId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('tour_hotspots')
      .delete()
      .eq('id', hotspotId);

    if (error) {
      console.error('Error deleting tour hotspot:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
