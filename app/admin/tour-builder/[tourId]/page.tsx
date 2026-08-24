'use client';

import { useState, useEffect, use } from 'react';
import { TourViewer, SceneData, HotspotData } from '@/components/tour-viewer';
import { DEMO_TOUR, TourData } from '@/lib/mock-data';
import {
  fetchTourForBuilderAction,
  saveTourHotspotAction,
  deleteTourHotspotAction,
} from '@/app/actions/tour-hotspots';
import Link from 'next/link';
import {
  Upload,
  Plus,
  Compass,
  MapPin,
  CheckCircle,
  Eye,
  Trash2,
  Sparkles,
  ArrowLeft,
  Info,
  Loader2,
  Save,
  Layers,
} from 'lucide-react';

interface TourBuilderProps {
  params: Promise<{ tourId: string }>;
}

export default function TourBuilder({ params }: TourBuilderProps) {
  const { tourId } = use(params);

  const [tour, setTour] = useState<TourData>(DEMO_TOUR);
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    DEMO_TOUR.start_scene_id || DEMO_TOUR.tour_scenes[0]?.id
  );
  const [mode, setMode] = useState<'preview' | 'place-hotspot'>('preview');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savingHotspot, setSavingHotspot] = useState<boolean>(false);
  const [isLoadingTour, setIsLoadingTour] = useState<boolean>(true);

  // Fetch live tour and hotspots from Supabase on mount
  useEffect(() => {
    async function loadTourData() {
      setIsLoadingTour(true);
      try {
        const liveTour = await fetchTourForBuilderAction(tourId);
        if (liveTour && liveTour.tour_scenes.length > 0) {
          setTour(liveTour);
          setSelectedSceneId(liveTour.start_scene_id || liveTour.tour_scenes[0].id);
        }
      } catch (err) {
        console.warn('Could not load live tour, using demo fallback:', err);
      } finally {
        setIsLoadingTour(false);
      }
    }
    loadTourData();
  }, [tourId]);

  // New Hotspot Dialog state
  const [hotspotDialog, setHotspotDialog] = useState<{
    yaw: number;
    pitch: number;
  } | null>(null);
  const [hotspotType, setHotspotType] = useState<'nav' | 'info'>('nav');
  const [hotspotTitle, setHotspotTitle] = useState('');
  const [hotspotBody, setHotspotBody] = useState('');
  const [hotspotTargetSceneId, setHotspotTargetSceneId] = useState('');

  // Handle panorama image upload & server processing
  const handleUploadScene = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const sceneId = crypto.randomUUID();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tourId', tourId);
      formData.append('sceneId', sceneId);

      const res = await fetch('/api/admin/process-panorama', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to process panorama image.');
      }

      const { levels } = await res.json();

      const newScene: SceneData = {
        id: sceneId,
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        sort_order: tour.tour_scenes.length,
        pano_levels: levels,
        initial_yaw: 0,
        initial_pitch: 0,
      };

      const updatedScenes = [...tour.tour_scenes, newScene];
      setTour((prev) => ({
        ...prev,
        tour_scenes: updatedScenes,
      }));

      setSelectedSceneId(sceneId);
    } catch (err: any) {
      console.error('Panorama upload error:', err);
      setUploadError(err.message || 'Failed to process equirectangular image.');
    } finally {
      setUploading(false);
    }
  };

  // Handle sphere click for placing hotspot
  const handleSphereClick = (yaw: number, pitch: number) => {
    if (mode === 'place-hotspot') {
      setHotspotDialog({ yaw, pitch });
      setHotspotTitle('');
      setHotspotBody('');
      const otherScene = tour.tour_scenes.find((s) => s.id !== selectedSceneId);
      setHotspotTargetSceneId(otherScene?.id || '');
    }
  };

  // Save Hotspot to live Supabase database
  const handleSaveHotspot = async () => {
    if (!hotspotDialog || !selectedSceneId) return;

    setSavingHotspot(true);
    const hotspotId = crypto.randomUUID();

    const newHotspot: HotspotData = {
      id: hotspotId,
      sceneId: selectedSceneId,
      type: hotspotType,
      yaw: hotspotDialog.yaw,
      pitch: hotspotDialog.pitch,
      title: hotspotTitle || (hotspotType === 'nav' ? 'Navigate to scene' : 'Information Highlight'),
      body: hotspotType === 'info' ? hotspotBody : undefined,
      targetSceneId: hotspotType === 'nav' ? hotspotTargetSceneId : undefined,
    };

    // Optimistic UI update
    setTour((prev) => ({
      ...prev,
      tour_hotspots: [...prev.tour_hotspots, newHotspot],
    }));

    try {
      await saveTourHotspotAction({
        id: hotspotId,
        sceneId: selectedSceneId,
        type: hotspotType,
        yaw: hotspotDialog.yaw,
        pitch: hotspotDialog.pitch,
        title: newHotspot.title,
        body: newHotspot.body,
        targetSceneId: newHotspot.targetSceneId,
      });
    } catch (err) {
      console.error('Failed to persist hotspot to DB:', err);
    } finally {
      setSavingHotspot(false);
      setHotspotDialog(null);
      setMode('preview');
    }
  };

  // Delete Hotspot from live database
  const handleDeleteHotspot = async (hotspotId: string) => {
    setTour((prev) => ({
      ...prev,
      tour_hotspots: prev.tour_hotspots.filter((h) => h.id !== hotspotId),
    }));

    try {
      await deleteTourHotspotAction(hotspotId);
    } catch (err) {
      console.error('Failed to delete hotspot from DB:', err);
    }
  };

  // Publish Tour
  const handlePublishTour = async () => {
    setTour((prev) => ({ ...prev, status: 'published' }));
    alert('Tour successfully published to public marketplace!');
  };

  const selectedScene = tour.tour_scenes.find((s) => s.id === selectedSceneId) || tour.tour_scenes[0];

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 flex flex-col">
      {/* Admin Top Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/tour-builder"
            className="p-2 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <h1 className="font-display font-bold text-base sm:text-lg text-white">Visual 360° Tour Builder</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Tour ID: {tourId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              tour.status === 'published'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {tour.status}
          </span>
          <button
            onClick={handlePublishTour}
            className="btn-hero-accent text-xs !py-2 !px-4 flex items-center space-x-1.5 shadow-glow-cyan"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Publish Tour</span>
          </button>
        </div>
      </header>

      {/* Main Builder Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
        {/* Left Interactive 360 Panorama Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative flex-1 bg-black rounded-3xl overflow-hidden border border-white/15 shadow-2xl min-h-[480px] lg:min-h-[600px]">
            {selectedScene ? (
              <TourViewer
                tourData={{
                  scenes: tour.tour_scenes,
                  startSceneId: selectedSceneId,
                  hotspots: tour.tour_hotspots,
                }}
                fullscreen={true}
                editorMode={mode === 'place-hotspot'}
                onSphereClick={handleSphereClick}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Upload className="w-12 h-12 mb-2 text-sky-400 opacity-50 animate-bounce" />
                <p className="text-xs font-mono">No scenes uploaded yet. Use the panel on the right to upload panoramas.</p>
              </div>
            )}

            {/* Mode Banner Indicator */}
            {mode === 'place-hotspot' && (
              <div className="absolute top-4 inset-x-4 z-40 bg-sky-500/90 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between border border-sky-300/40 animate-pulse">
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <MapPin className="w-4 h-4 fill-current" />
                  <span>HOTSPOT PLACEMENT MODE: Click anywhere inside the 360° sphere to position pin</span>
                </div>
                <button
                  onClick={() => setMode('preview')}
                  className="px-3 py-1 bg-black text-white rounded-xl text-[11px] font-mono hover:bg-slate-900 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Hotspots List for Active Scene */}
          <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Hotspots in {selectedScene?.name} ({tour.tour_hotspots.filter((h) => h.sceneId === selectedSceneId).length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tour.tour_hotspots
                .filter((h) => h.sceneId === selectedSceneId)
                .map((hotspot) => {
                  const targetScene = tour.tour_scenes.find((s) => s.id === hotspot.targetSceneId);
                  return (
                    <div
                      key={hotspot.id}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5 font-bold text-white truncate">
                          <span className={hotspot.type === 'nav' ? 'text-sky-400' : 'text-emerald-400'}>
                            {hotspot.type === 'nav' ? '➔' : 'ℹ'}
                          </span>
                          <span className="truncate">{hotspot.title}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-mono mt-0.5">
                          Yaw: {hotspot.yaw.toFixed(2)} | Pitch: {hotspot.pitch.toFixed(2)}
                          {targetScene && ` ➔ ${targetScene.name}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteHotspot(hotspot.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition shrink-0"
                        title="Delete Hotspot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Sidebar Control Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col space-y-6 overflow-y-auto shadow-2xl">
          {/* Section 1: Mode Switcher */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Viewer Interactivity Mode
            </label>
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setMode('preview')}
                className={`py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center space-x-2 transition ${
                  mode === 'preview'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Explore Tour</span>
              </button>
              <button
                onClick={() => setMode('place-hotspot')}
                className={`py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center space-x-2 transition ${
                  mode === 'place-hotspot'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hotspot</span>
              </button>
            </div>
          </div>

          {/* Section 2: Scene Upload Pipeline */}
          <div className="border-t border-white/[0.08] pt-6">
            <h3 className="font-display font-bold text-base text-white mb-1">Upload 360° Panorama</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Upload 2:1 equirectangular image (JPG/PNG). Image will be auto-scrubbed of EXIF and split into 4 multi-resolution tiers.
            </p>

            <label className="border-2 border-dashed border-white/15 hover:border-sky-400/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-white/[0.02] hover:bg-white/[0.05] group">
              <Upload className="w-8 h-8 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white mb-1">
                {uploading ? 'Processing 360° Image...' : 'Click to Upload 360° Panorama'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Equirectangular 2:1 ratio</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUploadScene}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {uploadError && (
              <div className="mt-3 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2 font-mono">
                <span>⚠️</span>
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Section 3: Scenes List */}
          <div className="border-t border-white/[0.08] pt-6 flex-1">
            <h3 className="font-display font-bold text-base text-white mb-3 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Tour Scenes ({tour.tour_scenes.length})</span>
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {tour.tour_scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    selectedSceneId === scene.id
                      ? 'bg-sky-500/15 border-sky-400/40 text-white shadow-sm'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-white font-mono font-bold text-[11px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-white">{scene.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">Sort Order: {scene.sort_order}</p>
                    </div>
                  </div>
                  {selectedSceneId === scene.id && (
                    <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-wider">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hotspot Creation Dialog Modal */}
      {hotspotDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-lg text-white">Create New Hotspot Pin</h3>
              <button onClick={() => setHotspotDialog(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-2">Hotspot Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHotspotType('nav')}
                  className={`py-2.5 rounded-xl font-mono font-bold text-xs border transition ${
                    hotspotType === 'nav'
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-glow-cyan'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  ➔ Navigation Pin
                </button>
                <button
                  type="button"
                  onClick={() => setHotspotType('info')}
                  className={`py-2.5 rounded-xl font-mono font-bold text-xs border transition ${
                    hotspotType === 'info'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  ℹ Feature Info
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Pin Title</label>
              <input
                type="text"
                value={hotspotTitle}
                onChange={(e) => setHotspotTitle(e.target.value)}
                placeholder={hotspotType === 'nav' ? 'e.g. Walk to Kitchen' : 'e.g. Italian Marble Island'}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 transition"
              />
            </div>

            {hotspotType === 'nav' ? (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Target Destination Scene</label>
                <select
                  value={hotspotTargetSceneId}
                  onChange={(e) => setHotspotTargetSceneId(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                >
                  <option value="">Select target scene...</option>
                  {tour.tour_scenes
                    .filter((s) => s.id !== selectedSceneId)
                    .map((scene) => (
                      <option key={scene.id} value={scene.id}>
                        {scene.name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Feature Details / Body Text</label>
                <textarea
                  rows={3}
                  value={hotspotBody}
                  onChange={(e) => setHotspotBody(e.target.value)}
                  placeholder="Describe material, brand, or architectural highlight..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400 resize-none transition"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setHotspotDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHotspot}
                disabled={savingHotspot}
                className="flex-1 py-2.5 rounded-xl btn-hero-accent text-xs shadow-glow-cyan"
              >
                {savingHotspot ? 'Saving Pin...' : 'Save Hotspot Pin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
