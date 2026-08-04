'use client';

import { useState, use } from 'react';
import { TourViewer, SceneData, HotspotData } from '@/components/tour-viewer';
import { DEMO_TOUR, TourData } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
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
} from 'lucide-react';

interface TourBuilderProps {
  params: Promise<{ tourId: string }>;
}

export default function TourBuilder({ params }: TourBuilderProps) {
  const { tourId } = use(params);
  const supabase = createClient();

  const [tour, setTour] = useState<TourData>(DEMO_TOUR);
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    DEMO_TOUR.start_scene_id || DEMO_TOUR.tour_scenes[0]?.id
  );
  const [mode, setMode] = useState<'preview' | 'place-hotspot'>('preview');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      await supabase.from('tour_scenes').insert(newScene);
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

  // Save Hotspot
  const handleSaveHotspot = async () => {
    if (!hotspotDialog || !selectedSceneId) return;

    const newHotspot: HotspotData = {
      id: crypto.randomUUID(),
      sceneId: selectedSceneId,
      type: hotspotType,
      yaw: hotspotDialog.yaw,
      pitch: hotspotDialog.pitch,
      title: hotspotTitle || (hotspotType === 'nav' ? 'Navigate to scene' : 'Information Highlight'),
      body: hotspotType === 'info' ? hotspotBody : undefined,
      targetSceneId: hotspotType === 'nav' ? hotspotTargetSceneId : undefined,
    };

    setTour((prev) => ({
      ...prev,
      tour_hotspots: [...prev.tour_hotspots, newHotspot],
    }));

    await supabase.from('tour_hotspots').insert(newHotspot);
    setHotspotDialog(null);
    setMode('preview');
  };

  // Delete Hotspot
  const handleDeleteHotspot = (hotspotId: string) => {
    setTour((prev) => ({
      ...prev,
      tour_hotspots: prev.tour_hotspots.filter((h) => h.id !== hotspotId),
    }));
  };

  // Publish Tour
  const handlePublishTour = async () => {
    setTour((prev) => ({ ...prev, status: 'published' }));
    alert('Tour successfully published!');
  };

  const selectedScene = tour.tour_scenes.find((s) => s.id === selectedSceneId) || tour.tour_scenes[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Admin Top Navbar */}
      <header className="bg-estate-card border-b border-estate-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/tour-builder"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-brass" />
              <h1 className="font-serif font-bold text-xl text-white">Visual 360° Tour Builder</h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">Tour ID: {tourId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              tour.status === 'published' ? 'bg-fern/20 text-fern border border-fern/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {tour.status}
          </span>
          <button
            onClick={handlePublishTour}
            className="px-5 py-2.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 transition flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Tour</span>
          </button>
        </div>
      </header>

      {/* Main Builder Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left Interactive 360 Panorama Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative flex-1 bg-slate-900 rounded-3xl overflow-hidden border border-estate-border shadow-2xl min-h-[500px]">
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
                <Upload className="w-12 h-12 mb-2 text-brass opacity-50" />
                <p>No scenes uploaded yet. Use the control panel on the right to upload panoramas.</p>
              </div>
            )}

            {/* Mode Banner Indicator */}
            {mode === 'place-hotspot' && (
              <div className="absolute top-4 inset-x-4 z-40 bg-brass/90 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 fill-current" />
                  <span>HOTSPOT PLACEMENT MODE: Click anywhere on the panorama sphere to position pin</span>
                </div>
                <button
                  onClick={() => setMode('preview')}
                  className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Hotspots List for Active Scene */}
          <div className="bg-estate-card border border-estate-border rounded-2xl p-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
              Hotspots in {selectedScene?.name} ({tour.tour_hotspots.filter((h) => h.sceneId === selectedSceneId).length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tour.tour_hotspots
                .filter((h) => h.sceneId === selectedSceneId)
                .map((hotspot) => {
                  const targetScene = tour.tour_scenes.find((s) => s.id === hotspot.targetSceneId);
                  return (
                    <div
                      key={hotspot.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1 font-bold text-white truncate">
                          <span className={hotspot.type === 'nav' ? 'text-brass' : 'text-fern'}>
                            {hotspot.type === 'nav' ? '➔' : 'ℹ'}
                          </span>
                          <span className="truncate">{hotspot.title}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          Yaw: {hotspot.yaw.toFixed(2)} | Pitch: {hotspot.pitch.toFixed(2)}
                          {targetScene && ` ➔ ${targetScene.name}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteHotspot(hotspot.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition shrink-0"
                        title="Delete Hotspot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Sidebar Control Panel (4 cols) */}
        <div className="lg:col-span-4 bg-estate-card border border-estate-border rounded-3xl p-6 flex flex-col space-y-6 overflow-y-auto">
          {/* Section 1: Mode Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Viewer Interactivity Mode
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setMode('preview')}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                  mode === 'preview'
                    ? 'bg-brass text-slate-950 shadow-lg shadow-brass/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Explore Tour</span>
              </button>
              <button
                onClick={() => setMode('place-hotspot')}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                  mode === 'place-hotspot'
                    ? 'bg-brass text-slate-950 shadow-lg shadow-brass/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Hotspot</span>
              </button>
            </div>
          </div>

          {/* Section 2: Scene Upload Pipeline */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="font-serif font-bold text-lg text-white mb-1">Upload 360° Panorama</h3>
            <p className="text-xs text-slate-400 mb-4">
              Upload 2:1 equirectangular image (JPG/PNG). Image will be auto-scrubbed of EXIF and split into 4 multi-resolution tiers.
            </p>

            <label className="border-2 border-dashed border-slate-700 hover:border-brass rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-900/50 hover:bg-slate-900 group">
              <Upload className="w-8 h-8 text-brass mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white mb-1">
                {uploading ? 'Processing Image...' : 'Click to Upload 360° Image'}
              </span>
              <span className="text-[10px] text-slate-500">Equirectangular 2:1 ratio (min 4000x2000px)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUploadScene}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {uploadError && (
              <div className="mt-3 p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center space-x-2">
                <span>⚠️</span>
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Section 3: Scenes List */}
          <div className="border-t border-slate-800 pt-6 flex-1">
            <h3 className="font-serif font-bold text-lg text-white mb-3">
              Tour Scenes ({tour.tour_scenes.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {tour.tour_scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    selectedSceneId === scene.id
                      ? 'bg-slate-900 border-brass shadow-md shadow-brass/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{scene.name}</h4>
                      <p className="text-[10px] text-slate-400">Sort Order: {scene.sort_order}</p>
                    </div>
                  </div>
                  {selectedSceneId === scene.id && (
                    <span className="text-xs text-brass font-bold uppercase tracking-wider">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hotspot Creation Dialog Modal */}
      {hotspotDialog && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-estate-card border border-estate-border max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">Create New Hotspot Pin</h3>
              <button onClick={() => setHotspotDialog(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Hotspot Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHotspotType('nav')}
                  className={`py-2 rounded-xl font-bold text-xs border ${
                    hotspotType === 'nav'
                      ? 'bg-brass text-slate-950 border-brass'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  ➔ Navigation Pin
                </button>
                <button
                  type="button"
                  onClick={() => setHotspotType('info')}
                  className={`py-2 rounded-xl font-bold text-xs border ${
                    hotspotType === 'info'
                      ? 'bg-fern text-slate-950 border-fern'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  ℹ Feature Info Highlight
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Pin Title</label>
              <input
                type="text"
                value={hotspotTitle}
                onChange={(e) => setHotspotTitle(e.target.value)}
                placeholder={hotspotType === 'nav' ? 'e.g. Walk to Kitchen' : 'e.g. Marble Countertop'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brass"
              />
            </div>

            {hotspotType === 'nav' ? (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Destination Scene</label>
                <select
                  value={hotspotTargetSceneId}
                  onChange={(e) => setHotspotTargetSceneId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brass"
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Feature Details / Body Text</label>
                <textarea
                  rows={3}
                  value={hotspotBody}
                  onChange={(e) => setHotspotBody(e.target.value)}
                  placeholder="Describe material, brand, or feature highlights..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setHotspotDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHotspot}
                className="flex-1 py-2.5 rounded-xl bg-brass text-slate-950 font-bold text-xs hover:bg-brass-hover transition shadow-lg shadow-brass/20"
              >
                Save Hotspot Pin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
