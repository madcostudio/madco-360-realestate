'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export interface SceneData {
  id: string;
  name: string;
  sort_order: number;
  pano_levels: { preview: string; low: string; med: string; high: string };
  initial_yaw: number;
  initial_pitch: number;
  initial_zoom?: number;
}

export interface HotspotData {
  id: string;
  sceneId: string;
  yaw: number;
  pitch: number;
  type: 'nav' | 'info';
  targetSceneId?: string;
  title: string;
  body?: string;
  icon?: string;
}

interface TourViewerProps {
  tourData: {
    scenes: SceneData[];
    startSceneId: string;
    hotspots: HotspotData[];
  };
  onSceneChange?: (sceneId: string, sceneName: string) => void;
  onSphereClick?: (yaw: number, pitch: number) => void;
  fullscreen?: boolean;
  editorMode?: boolean;
}

export function TourViewer({
  tourData,
  onSceneChange,
  onSphereClick,
  fullscreen = false,
  editorMode = false,
}: TourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [currentSceneName, setCurrentSceneName] = useState<string>('');
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState<boolean>(false);
  const [activeInfoModal, setActiveInfoModal] = useState<{ title: string; body?: string } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!tourData.scenes || tourData.scenes.length === 0) return;

    const startScene =
      tourData.scenes.find((s) => s.id === tourData.startSceneId) || tourData.scenes[0];

    // Adaptive panorama image resolution selector
    const getAdaptiveImage = (levels: SceneData['pano_levels']) => {
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn?.effectiveType === '4g') return levels.high || levels.med || levels.low || levels.preview;
        if (conn?.effectiveType === '3g') return levels.med || levels.low || levels.preview;
        return levels.low || levels.preview;
      }
      return levels.med || levels.low || levels.preview;
    };

    // Helper to truncate long filenames (e.g. from camera)
    const formatSceneName = (name: string) => {
      const shortName = name.replace(/(_exported)?(\.[a-zA-Z0-9]+)?$/i, '');
      return shortName.length > 25 ? shortName.substring(0, 25) + '...' : shortName;
    };

    // Instantiate Photo Sphere Viewer
    const viewer = new Viewer({
      container: containerRef.current,
      panorama: getAdaptiveImage(startScene.pano_levels),
      defaultYaw: startScene.initial_yaw || 0,
      defaultPitch: startScene.initial_pitch || 0,
      defaultZoomLvl: 10,
      navbar: [
        'zoom',
        'move',
        'markers',
        'gyroscope',
        'fullscreen',
      ],
      plugins: [
        [
          VirtualTourPlugin,
          {
            preload: true,
            transitionOptions: {
              showSegment: false,
              fadeIn: true,
            },
          },
        ],
        [GyroscopePlugin, {}],
        [
          MarkersPlugin,
          {
            markers: [],
          },
        ],
      ],
    });

    viewerRef.current = viewer;
    setCurrentSceneName(startScene.name);

    const virtualTourPlugin = viewer.getPlugin(VirtualTourPlugin) as VirtualTourPlugin;
    const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;

    // Register scenes in Virtual Tour plugin
    const formattedScenes = tourData.scenes.map((scene) => ({
      id: scene.id,
      panorama: getAdaptiveImage(scene.pano_levels),
      name: scene.name,
      defaultYaw: scene.initial_yaw,
      defaultPitch: scene.initial_pitch,
    }));

    virtualTourPlugin.setNodes(formattedScenes, startScene.id);

    // Render Markers for current scene
    const renderSceneMarkers = (sceneId: string) => {
      if (!markersPlugin) return;
      markersPlugin.clearMarkers();

      const sceneHotspots = tourData.hotspots.filter((h) => h.sceneId === sceneId);

      sceneHotspots.forEach((hotspot) => {
        if (hotspot.type === 'nav') {
          markersPlugin.addMarker({
            id: `marker-${hotspot.id}`,
            position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
            image: '/marker-nav.svg',
            size: { width: 50, height: 50 },
            anchor: 'bottom center',
            tooltip: {
              content: `<b>${hotspot.title}</b>`,
              position: 'top center',
            },
            data: { hotspot },
          });
        } else if (hotspot.type === 'info') {
          markersPlugin.addMarker({
            id: `marker-${hotspot.id}`,
            position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
            image: '/marker-info.svg',
            size: { width: 44, height: 44 },
            anchor: 'bottom center',
            tooltip: {
              content: `<b>${hotspot.title}</b>`,
              position: 'top center',
            },
            data: { hotspot },
          });
        }
      });
    };

    renderSceneMarkers(startScene.id);

    // Listen for marker selection
    markersPlugin?.addEventListener('select-marker', ({ marker }: any) => {
      const hotspot: HotspotData = marker.data?.hotspot;
      if (!hotspot) return;

      if (hotspot.type === 'nav' && hotspot.targetSceneId) {
        virtualTourPlugin.setCurrentNode(hotspot.targetSceneId);
      } else if (hotspot.type === 'info') {
        setActiveInfoModal({ title: hotspot.title, body: hotspot.body });
      }
    });

    // Listen for virtual tour node changes
    virtualTourPlugin.addEventListener('node-changed', ({ node }: any) => {
      const activeScene = tourData.scenes.find((s) => s.id === node.id);
      if (activeScene) {
        setCurrentSceneName(activeScene.name);
        renderSceneMarkers(activeScene.id);
        onSceneChange?.(activeScene.id, activeScene.name);
      }
    });

    // Handle interactive click in editor mode
    if (editorMode || onSphereClick) {
      viewer.addEventListener('click', ({ data }: any) => {
        if (data.yaw !== undefined && data.pitch !== undefined) {
          onSphereClick?.(data.yaw, data.pitch);
        }
      });
    }

    return () => {
      viewer.destroy();
    };
  }, [tourData, editorMode, onSceneChange, onSphereClick]);

  const toggleGyroscope = async () => {
    if (!viewerRef.current) return;
    const gyroPlugin = viewerRef.current.getPlugin(GyroscopePlugin) as GyroscopePlugin;
    if (gyroPlugin) {
      if (gyroscopeEnabled) {
        gyroPlugin.stop();
        setGyroscopeEnabled(false);
      } else {
        await gyroPlugin.start();
        setGyroscopeEnabled(true);
      }
    }
  };

  return (
    <div className={`relative ${fullscreen ? 'w-full h-full' : 'w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-estate-border'}`}>
      <div ref={containerRef} className="w-full h-full bg-slate-950" />

      {/* Floating Scene Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-estate-card/90 backdrop-blur-md border border-brass/30 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-fern animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-brass font-medium">Active Room</span>
          <span className="text-slate-300 font-bold text-[10px] sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">| {currentSceneName}</span>
        </div>
      </div>

      {/* Gyroscope Floating Button */}
      <div className="absolute bottom-16 right-4 z-10">
        <button
          onClick={toggleGyroscope}
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl ${
            gyroscopeEnabled
              ? 'bg-brass text-slate-950 border-brass shadow-brass/50 scale-105'
              : 'bg-estate-card/80 text-white border-slate-700 hover:border-brass/50'
          }`}
          title="Toggle Gyroscope / Motion Sensor"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </button>
      </div>

      {/* Info Hotspot Modal Dialog Overlay */}
      {activeInfoModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-estate-card border border-brass/40 text-white max-w-md w-full rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-fern text-xl">ℹ</span>
                <h3 className="font-serif font-bold text-xl text-brass">{activeInfoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {activeInfoModal.body || 'No detailed description provided for this highlight.'}
            </p>
            <button
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-2.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold transition duration-200 shadow-lg shadow-brass/20"
            >
              Close Feature Highlight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
