import { TourViewer } from '@/components/tour-viewer';
import { createClient } from '@/lib/supabase/server';
import { DEMO_PROPERTY, DEMO_TOUR, PropertyData } from '@/lib/mock-data';
import { trackEvent } from '@/lib/events';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TourHeaderOverlay } from '@/components/tour-header-overlay';
import { TourContactCta } from '@/components/tour-contact-cta';

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;
  const supabase = createClient();

  const { data: property } = await supabase
    .from('properties')
    .select('id, title, price, bhk, tour_id, address, slug')
    .eq('slug', slug)
    .single();

  const activeProperty: PropertyData = property || (slug === DEMO_PROPERTY.slug ? DEMO_PROPERTY : DEMO_PROPERTY);

  if (!activeProperty) {
    notFound();
  }

  const { data: tour } = await supabase
    .from('tours')
    .select(`
      id, start_scene_id, status,
      tour_scenes(id, name, sort_order, pano_levels, initial_yaw, initial_pitch),
      tour_hotspots(id, scene_id, type, yaw, pitch, target_scene_id, title, body)
    `)
    .eq('id', activeProperty.tour_id)
    .single();

  const activeTour = tour || DEMO_TOUR;

  // Log tour_open event
  await trackEvent('tour_open', activeProperty.id, { slug: activeProperty.slug });

  return (
    <div className="fixed inset-0 bg-slate-950 text-white overflow-hidden select-none">
      {/* 360° Photo Sphere Viewer */}
      <TourViewer
        tourData={{
          scenes: activeTour.tour_scenes,
          startSceneId: activeTour.start_scene_id,
          hotspots: activeTour.tour_hotspots,
        }}
        fullscreen={true}
      />

      {/* Glassmorphic Sticky Header Overlay */}
      <TourHeaderOverlay
        title={activeProperty.title}
        price={activeProperty.price}
        address={activeProperty.address}
        slug={activeProperty.slug}
      />

      {/* Floating Bottom Contact Overlay */}
      <TourContactCta propertyId={activeProperty.id} propertyTitle={activeProperty.title} />
    </div>
  );
}
