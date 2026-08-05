import { TourViewer } from '@/components/tour-viewer';
import { getPropertyBySlug, getTourById } from '@/lib/supabase/queries';
import { PropertyData, TourData, DEMO_TOUR } from '@/lib/mock-data';
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

  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const activeProperty: PropertyData = property;
  const tour = activeProperty.tour_id ? await getTourById(activeProperty.tour_id) : DEMO_TOUR;
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
