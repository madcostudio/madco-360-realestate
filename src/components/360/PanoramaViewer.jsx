import React, { useEffect, useRef, useState } from 'react';
import { 
  Eye, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Info, 
  Compass, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { generateEquirectangularPanorama } from '../../utils/panoramaGenerator';

export default function PanoramaViewer({ tourData, propertyTitle, locality }) {
  if (!tourData || !tourData.rooms || tourData.rooms.length === 0) {
    return (
      <div className="w-full h-[500px] bg-slate-900 flex items-center justify-center text-slate-400 rounded-2xl border border-slate-800">
        <p>No 360° tour data available for this property.</p>
      </div>
    );
  }

  const [currentRoomId, setCurrentRoomId] = useState(tourData.startRoomId || tourData.rooms[0].id);
  const currentRoom = tourData.rooms.find(r => r.id === currentRoomId) || tourData.rooms[0];

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Camera orientation state (degrees)
  const [yaw, setYaw] = useState(currentRoom.initialYaw || 0);
  const [pitch, setPitch] = useState(currentRoom.initialPitch || 0);
  const [fov, setFov] = useState(75); // Field of View (zoom level)

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showRoomDrawer, setShowRoomDrawer] = useState(false);
  const [showFloorplanMap, setShowFloorplanMap] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Image texture cache
  const textureImageRef = useRef(null);
  const panoramaDataUrlRef = useRef(null);

  // Reset view when room changes
  useEffect(() => {
    setYaw(currentRoom.initialYaw || 0);
    setPitch(currentRoom.initialPitch || 0);
    
    // Generate / Load equirectangular panorama texture for current room
    const dataUrl = currentRoom.panoramaUrl || generateEquirectangularPanorama(currentRoom.presetType || 'living');
    panoramaDataUrlRef.current = dataUrl;

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      textureImageRef.current = img;
      renderPanorama();
    };

    triggerToast(`Entered ${currentRoom.name}`);
  }, [currentRoomId]);

  function triggerToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  // Render 360 Equirectangular Projection on 2D Canvas
  const renderPanorama = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const img = textureImageRef.current;
    if (!img) return;

    ctx.clearRect(0, 0, width, height);

    // Calculate source slice position from equirectangular texture based on Yaw & Pitch & FOV
    // Equirectangular width represents 360 deg, height 180 deg
    const normalizedYaw = ((yaw % 360) + 360) % 360;
    const yawPercent = normalizedYaw / 360;
    
    // FOV width coverage (e.g. 75 deg FOV = 75/360 width)
    const fovWidthRatio = fov / 360;
    const fovHeightRatio = (fov * (height / width)) / 180;

    const srcW = img.width * fovWidthRatio;
    const srcH = img.height * fovHeightRatio;

    let srcX = (img.width * yawPercent) - (srcW / 2);
    // Pitch shift (clamp between -45 to 45 deg)
    const pitchOffset = (pitch / 90) * (img.height * 0.25);
    let srcY = (img.height * 0.5) - (srcH / 2) - pitchOffset;

    // Wrap around X boundaries
    if (srcX < 0) {
      // Draw split right side
      const rightW = -srcX;
      ctx.drawImage(img, img.width - rightW, srcY, rightW, srcH, 0, 0, width * (rightW / srcW), height);
      ctx.drawImage(img, 0, srcY, srcW - rightW, srcH, width * (rightW / srcW), 0, width * (1 - (rightW / srcW)), height);
    } else if (srcX + srcW > img.width) {
      // Draw split left side
      const leftW = img.width - srcX;
      ctx.drawImage(img, srcX, srcY, leftW, srcH, 0, 0, width * (leftW / srcW), height);
      ctx.drawImage(img, 0, srcY, srcW - leftW, srcH, width * (leftW / srcW), 0, width * (1 - (leftW / srcW)), height);
    } else {
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, width, height);
    }

    // Render Hotspots onto Canvas Overlay
    renderHotspots(width, height);
  };

  // Convert 360 (yaw, pitch) coordinates to 2D screen coordinates
  const getHotspotScreenPos = (hsYaw, hsPitch, canvasWidth, canvasHeight) => {
    // Relative yaw delta from current camera yaw
    let deltaYaw = hsYaw - yaw;
    // Normalize to [-180, 180]
    while (deltaYaw > 180) deltaYaw -= 360;
    while (deltaYaw < -180) deltaYaw += 360;

    // Relative pitch delta
    const deltaPitch = hsPitch - pitch;

    // Check if within camera FOV (+- FOV/2)
    const halfFovX = fov / 2;
    const halfFovY = (fov * (canvasHeight / canvasWidth)) / 2;

    if (Math.abs(deltaYaw) > halfFovX || Math.abs(deltaPitch) > halfFovY * 1.5) {
      return null; // Out of frame
    }

    const screenX = (canvasWidth / 2) + (deltaYaw / halfFovX) * (canvasWidth / 2);
    const screenY = (canvasHeight / 2) - (deltaPitch / halfFovY) * (canvasHeight / 2);

    return { x: screenX, y: screenY };
  };

  const renderHotspots = (w, h) => {
    // Handled in React overlay elements for rich interactive hover/clicks
  };

  // Redraw loop on Yaw/Pitch/FOV change
  useEffect(() => {
    renderPanorama();
  }, [yaw, pitch, fov]);

  // Auto-rotate animation ticker
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setYaw(prev => (prev + 0.25) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Mouse & Touch Drag Controls
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const sensitivity = fov / 400; // Smoother dragging at higher zoom
    setYaw(prev => prev - deltaX * sensitivity);
    setPitch(prev => Math.max(-45, Math.min(45, prev + deltaY * sensitivity)));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setFov(prev => Math.max(40, Math.min(100, prev + e.deltaY * 0.05)));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Compass Heading (0 = N, 90 = E, 180 = S, 270 = W)
  const getCompassDirection = () => {
    const norm = ((yaw % 360) + 360) % 360;
    if (norm >= 337.5 || norm < 22.5) return 'N (North)';
    if (norm >= 22.5 && norm < 67.5) return 'NE (North-East)';
    if (norm >= 67.5 && norm < 112.5) return 'E (East)';
    if (norm >= 112.5 && norm < 157.5) return 'SE (South-East)';
    if (norm >= 157.5 && norm < 202.5) return 'S (South)';
    if (norm >= 202.5 && norm < 247.5) return 'SW (South-West)';
    if (norm >= 247.5 && norm < 292.5) return 'W (West)';
    return 'NW (North-West)';
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[540px] md:h-[640px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 select-none group"
    >
      {/* 360 CANVAS */}
      <canvas
        ref={canvasRef}
        width={1400}
        height={800}
        className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* TOP BRANDING & VERIFICATION HEADER */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
            360°
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-white text-sm font-bold tracking-tight">{currentRoom.name}</h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED BY MAD.CO
              </span>
            </div>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" /> {locality}, Mangalore
            </p>
          </div>
        </div>

        {/* Compass & FOV indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 text-xs text-amber-400 font-semibold shadow-lg pointer-events-auto">
          <Compass className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{getCompassDirection()}</span>
        </div>
      </div>

      {/* HOTSPOT OVERLAYS */}
      {currentRoom.hotspots && currentRoom.hotspots.map(hs => {
        const pos = getHotspotScreenPos(hs.yaw, hs.pitch, 1400, 800);
        if (!pos) return null;

        // Scale pos from canvas coords (1400x800) to percentage
        const leftPct = (pos.x / 1400) * 100;
        const topPct = (pos.y / 800) * 100;

        return (
          <div
            key={hs.id}
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/hs pointer-events-auto"
            onClick={() => {
              if (hs.type === 'transition' && hs.targetRoomId) {
                setCurrentRoomId(hs.targetRoomId);
              } else {
                setSelectedHotspot(hs);
              }
            }}
          >
            {/* Animated Pulse Ring */}
            <div className="absolute inset-0 w-10 h-10 -ml-2 -mt-2 rounded-full bg-indigo-500/40 animate-ping" />

            {/* Hotspot Icon Badge */}
            <div className={`relative px-3.5 py-2 rounded-2xl backdrop-blur-xl border font-semibold text-xs shadow-xl flex items-center gap-2 transition-all transform group-hover/hs:scale-110 ${
              hs.type === 'transition' 
                ? 'bg-indigo-600/90 hover:bg-indigo-500 text-white border-indigo-400/50'
                : 'bg-amber-500/90 hover:bg-amber-400 text-slate-950 border-amber-300'
            }`}>
              {hs.type === 'transition' ? (
                <Eye className="w-4 h-4 text-indigo-200" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-950" />
              )}
              <span>{hs.title}</span>
              {hs.type === 'transition' && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
            </div>
          </div>
        );
      })}

      {/* INTERACTIVE RADAR FLOOR PLAN MINIMAP (BOTTOM RIGHT) */}
      {showFloorplanMap && (
        <div className="absolute bottom-16 right-4 z-20 bg-slate-950/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-800 shadow-2xl w-44 md:w-52 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" /> RADAR MINIMAP
            </span>
            <button 
              onClick={() => setShowFloorplanMap(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Interactive Floor Plan Grid */}
          <div className="relative w-full h-32 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

            {/* Room Nodes on Minimap */}
            {tourData.rooms.map(room => {
              const isActive = room.id === currentRoomId;
              const posX = room.floorMapPos ? room.floorMapPos.x : 50;
              const posY = room.floorMapPos ? room.floorMapPos.y : 50;

              return (
                <button
                  key={room.id}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  onClick={() => setCurrentRoomId(room.id)}
                  title={room.name}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all ${
                    isActive
                      ? 'bg-amber-400 ring-4 ring-amber-400/30 scale-125 z-10'
                      : 'bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              );
            })}

            {/* Radar Vision Cone attached to current active room node */}
            {currentRoom.floorMapPos && (
              <div
                style={{
                  left: `${currentRoom.floorMapPos.x}%`,
                  top: `${currentRoom.floorMapPos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${yaw}deg)`
                }}
                className="absolute pointer-events-none transition-transform duration-75"
              >
                {/* Vision Cone Wedge */}
                <div 
                  className="w-16 h-16 bg-gradient-to-t from-amber-400/40 via-amber-400/10 to-transparent opacity-80"
                  style={{ clipPath: 'polygon(50% 100%, 15% 0%, 85% 0%)', transform: 'translateY(-50%)' }}
                />
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-2">
            Click dots to jump rooms • Cone shows orientation
          </p>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-indigo-600/90 text-white text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-md border border-indigo-400/40 shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CONTROLS TOOLBAR (BOTTOM CENTER) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
        {/* Room Switcher Drawer Trigger */}
        <button
          onClick={() => setShowRoomDrawer(!showRoomDrawer)}
          className="bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-slate-700 backdrop-blur-md shadow-lg flex items-center gap-2 transition"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>{showRoomDrawer ? 'Hide Rooms' : `Rooms (${tourData.rooms.length})`}</span>
        </button>

        {/* Center Camera Actions */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          {/* Auto-Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Pause Auto-Rotate" : "Start Auto-Rotate"}
            className={`p-2 rounded-xl transition ${
              autoRotate ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset View */}
          <button
            onClick={() => {
              setYaw(currentRoom.initialYaw || 0);
              setPitch(currentRoom.initialPitch || 0);
              setFov(75);
              triggerToast('Camera position reset');
            }}
            title="Reset Camera View"
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Toggle Minimap */}
          {!showFloorplanMap && (
            <button
              onClick={() => setShowFloorplanMap(true)}
              title="Show Radar Minimap"
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              <Compass className="w-4 h-4 text-amber-400" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen 360 Mode"
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Drag Hint */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Click & Drag to rotate 360°</span>
        </div>
      </div>

      {/* ROOM SWITCHER THUMBNAIL DRAWER (SLIDE OVER) */}
      {showRoomDrawer && (
        <div className="absolute inset-x-4 top-16 z-30 bg-slate-950/95 backdrop-blur-2xl p-4 rounded-3xl border border-slate-800 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Select Spatial Room Node
            </h4>
            <button 
              onClick={() => setShowRoomDrawer(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {tourData.rooms.map(room => {
              const isSelected = room.id === currentRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setCurrentRoomId(room.id);
                    setShowRoomDrawer(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-900/80 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold truncate">{room.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {room.hotspots ? `${room.hotspots.length} Hotspots` : '360° Node'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* INFO HOTSPOT ANNOTATION MODAL */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{selectedHotspot.title}</h3>
                <span className="text-amber-400 text-xs font-semibold">Mad.co Verified Spatial Spec</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {selectedHotspot.description || 'Verified architectural detail inspected by Mad.co Studio during 360° scanning.'}
            </p>

            <button
              onClick={() => setSelectedHotspot(null)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg"
            >
              Close Annotation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
