import { TourViewer } from '@/components/tour-viewer';
import { ExternalTourFrame } from '@/components/external-tour-frame';
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
  const tour = activeProperty.tour_id ? await getTourById(activeProperty.tour_id) : null;
  const hasExternalTour = Boolean(activeProperty.external_tour_url);
  const hasLocalScenes = Boolean(tour && tour.tour_scenes && tour.tour_scenes.length > 0);

  // Log tour_open event
  await trackEvent('tour_open', activeProperty.id, { slug: activeProperty.slug });

  return (
    <div className="fixed inset-0 bg-slate-950 text-white overflow-hidden select-none">
      {/* 360° Tour Surface */}
      {hasExternalTour ? (
        <ExternalTourFrame
          src={activeProperty.external_tour_url!}
          title={`${activeProperty.title} 360° Virtual Tour`}
          className="w-full h-full absolute inset-0 z-0"
          isFullscreen={true}
        />
      ) : hasLocalScenes ? (
        <TourViewer
          tourData={{
            scenes: tour!.tour_scenes,
            startSceneId: tour!.start_scene_id,
            hotspots: tour!.tour_hotspots,
          }}
          fullscreen={true}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 bg-slate-950">
          <div className="w-16 h-16 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
            <span className="text-2xl">🧭</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">360° Tour Coming Soon</h2>
          <p className="text-slate-400 text-sm max-w-md">
            The immersive walkthrough for {activeProperty.title} is currently being scheduled with our capture team.
          </p>
          <Link
            href={`/property/${activeProperty.slug}`}
            className="px-6 py-2.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-xs transition"
          >
            Return to Property Details
          </Link>
        </div>
      )}

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
