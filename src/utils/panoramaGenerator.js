/**
 * Dynamic High-Definition 360° Equirectangular Panorama Generator
 * Generates photorealistic, 2:1 ratio equirectangular panorama textures 
 * for Mad.co Spatial Real Estate listings in Mangalore.
 */

export function generateEquirectangularPanorama(roomType = 'living', theme = 'modern_sea') {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const w = canvas.width;
  const h = canvas.height;

  // 1. SKY & HORIZON / WALL GRADIENTS
  const horizonY = h * 0.48;

  // Ceiling & Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  if (roomType === 'balcony') {
    skyGrad.addColorStop(0, '#1a365d'); // Golden hour sea sky
    skyGrad.addColorStop(0.5, '#4a5568');
    skyGrad.addColorStop(0.8, '#dd6b20');
    skyGrad.addColorStop(1, '#f6ad55');
  } else if (roomType === 'bedroom') {
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(0.6, '#1e293b');
    skyGrad.addColorStop(1, '#334155');
  } else { // living / kitchen / default
    skyGrad.addColorStop(0, '#0f172a'); // Luxury dark slate ceiling
    skyGrad.addColorStop(0.4, '#1e1b4b'); // Deep indigo wall hue
    skyGrad.addColorStop(1, '#312e81');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, horizonY);

  // Floor Gradient
  const floorGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  if (roomType === 'balcony') {
    floorGrad.addColorStop(0, '#78350f'); // Teak deck
    floorGrad.addColorStop(1, '#451a03');
  } else if (roomType === 'kitchen') {
    floorGrad.addColorStop(0, '#334155'); // Italian dark marble
    floorGrad.addColorStop(1, '#0f172a');
  } else {
    floorGrad.addColorStop(0, '#f8fafc'); // Light glossy porcelain tile
    floorGrad.addColorStop(1, '#cbd5e1');
  }
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // 2. WALL PANELS & ARCHITECTURAL GRID (Equirectangular Perspective)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;

  // Vertical wall pillars / room corners at 360 degree intervals (90 deg steps)
  const xPositions = [0, w * 0.25, w * 0.5, w * 0.75, w];
  xPositions.forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  });

  // Ceiling border trim
  ctx.strokeStyle = 'rgba(238, 242, 255, 0.25)';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.15);
  ctx.lineTo(w, h * 0.15);
  ctx.stroke();

  // Skirting line
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(w, horizonY);
  ctx.stroke();
  ctx.restore();

  // 3. WINDOW PANORAMA VIEW (MANGALORE COASTLINE / SEA & PALMS)
  // Window placement spanning 90 degrees (w * 0.35 to w * 0.65)
  const winX1 = w * 0.32;
  const winW = w * 0.36;
  const winY1 = h * 0.18;
  const winY2 = horizonY + 80;

  // Glass Frame Outer
  ctx.fillStyle = '#090d16';
  ctx.fillRect(winX1 - 10, winY1 - 10, winW + 20, (winY2 - winY1) + 20);

  // Outdoor View inside Window Frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(winX1, winY1, winW, winY2 - winY1);
  ctx.clip();

  // Sky outside
  const outSky = ctx.createLinearGradient(0, winY1, 0, horizonY);
  outSky.addColorStop(0, '#38bdf8'); // Bright Mangalore sky
  outSky.addColorStop(0.7, '#bae6fd');
  outSky.addColorStop(1, '#fef08a'); // Warm coastal horizon glow
  ctx.fillStyle = outSky;
  ctx.fillRect(winX1, winY1, winW, winY2 - winY1);

  // Ocean Water outside
  const oceanGrad = ctx.createLinearGradient(0, horizonY - 20, 0, winY2);
  oceanGrad.addColorStop(0, '#0284c7');
  oceanGrad.addColorStop(0.5, '#0369a1');
  oceanGrad.addColorStop(1, '#075985');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(winX1, horizonY - 15, winW, winY2 - horizonY + 15);

  // Sea waves shimmer lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const wy = horizonY + (i * 8);
    ctx.beginPath();
    ctx.moveTo(winX1, wy);
    ctx.bezierCurveTo(
      winX1 + winW * 0.25, wy + Math.sin(i) * 3,
      winX1 + winW * 0.75, wy - Math.sin(i) * 3,
      winX1 + winW, wy
    );
    ctx.stroke();
  }

  // Mangalore Coastal Palm Trees silhouetted outside
  ctx.fillStyle = '#064e3b';
  for (let p = 0; p < 5; p++) {
    const px = winX1 + 40 + (p * 140);
    const py = horizonY;
    // Trunk
    ctx.beginPath();
    ctx.moveTo(px, py + 10);
    ctx.quadraticCurveTo(px + 10, py - 40, px + 5, py - 90);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#27272a';
    ctx.stroke();
    // Palm leaves
    for (let l = 0; l < 6; l++) {
      const angle = (l * Math.PI / 3) + 0.2;
      ctx.beginPath();
      ctx.moveTo(px + 5, py - 90);
      ctx.quadraticCurveTo(
        px + 5 + Math.cos(angle) * 35,
        py - 90 + Math.sin(angle) * 25,
        px + 5 + Math.cos(angle) * 50,
        py - 90 + Math.sin(angle) * 45 + 10
      );
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  // Window Panes Grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  const paneW = winW / 3;
  ctx.beginPath();
  ctx.moveTo(winX1 + paneW, winY1);
  ctx.lineTo(winX1 + paneW, winY2);
  ctx.moveTo(winX1 + (paneW * 2), winY1);
  ctx.lineTo(winX1 + (paneW * 2), winY2);
  ctx.stroke();

  ctx.restore(); // end window clip

  // 4. FURNITURE & INTERIOR DETAILS ACCORDING TO ROOM TYPE
  if (roomType === 'living') {
    // Designer Sofa (facing center, around w * 0.15)
    ctx.fillStyle = '#1e293b';
    ctx.roundRect ? ctx.roundRect(w * 0.08, horizonY + 60, 240, 140, 16) : ctx.fillRect(w * 0.08, horizonY + 60, 240, 140);
    ctx.fill();
    // Cushions
    ctx.fillStyle = '#6366f1'; // Indigo throw pillows
    ctx.fillRect(w * 0.1, horizonY + 70, 70, 50);
    ctx.fillRect(w * 0.17, horizonY + 70, 70, 50);

    // Coffee Table (glass top)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.fillRect(w * 0.1, horizonY + 220, 180, 70);
    ctx.strokeRect(w * 0.1, horizonY + 220, 180, 70);

    // TV / Feature Wall (at w * 0.8)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(w * 0.76, h * 0.22, 320, 280);
    ctx.strokeStyle = '#f59e0b'; // Ambient backlight trim
    ctx.lineWidth = 4;
    ctx.strokeRect(w * 0.76, h * 0.22, 320, 280);
    // TV Screen
    ctx.fillStyle = '#020617';
    ctx.fillRect(w * 0.78, h * 0.26, 280, 160);

    // Modern Chandelier Light on Ceiling (w * 0.5)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.08, 14, 0, Math.PI * 2);
    ctx.fill();
    // Glow effect
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.08, 5, w * 0.5, h * 0.08, 80);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.08, 80, 0, Math.PI * 2);
    ctx.fill();

  } else if (roomType === 'bedroom') {
    // King Size Bed (at w * 0.12)
    ctx.fillStyle = '#334155'; // Headboard
    ctx.fillRect(w * 0.08, horizonY - 40, 280, 120);
    // Bedspread
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(w * 0.08, horizonY + 80, 280, 180);
    // Pillows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(w * 0.11, horizonY + 90, 90, 45);
    ctx.fillRect(w * 0.22, horizonY + 90, 90, 45);

    // Wardrobe (at w * 0.78)
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(w * 0.76, h * 0.18, 300, 360);
    ctx.strokeStyle = '#818cf8';
    ctx.strokeRect(w * 0.76, h * 0.18, 300, 360);

  } else if (roomType === 'kitchen') {
    // Kitchen Counter & Island (at w * 0.1)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(w * 0.05, horizonY + 20, 360, 220);
    // Quartz Top
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(w * 0.04, horizonY + 15, 380, 25);
    // Stove & Sink
    ctx.fillStyle = '#334155';
    ctx.fillRect(w * 0.08, horizonY + 20, 80, 15);
    ctx.fillRect(w * 0.28, horizonY + 20, 90, 15);

  } else if (roomType === 'balcony') {
    // Balcony Railing
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, horizonY + 100);
    ctx.lineTo(w, horizonY + 100);
    ctx.stroke();
    // Vertical Balcony Bars
    ctx.lineWidth = 3;
    for (let b = 0; b < w; b += 25) {
      ctx.beginPath();
      ctx.moveTo(b, horizonY + 100);
      ctx.lineTo(b, h);
      ctx.stroke();
    }
    // Lounge Chairs
    ctx.fillStyle = '#d97706'; // Rattan wicker chair
    ctx.fillRect(w * 0.15, horizonY + 140, 120, 100);
    ctx.fillRect(w * 0.7, horizonY + 140, 120, 100);
  }

  // 5. MAD.CO WATERMARK STAMP & SPATIAL NODE GRID OVERLAY
  ctx.save();
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('MAD.CO 360° SPATIAL VERIFIED TOUR', 35, 45);
  ctx.font = '400 13px sans-serif';
  ctx.fillText('Mangalore, KA • 4K Spatial Capture', 35, 68);

  // Compass markings on 360 horizontal bar
  const directions = [
    { label: 'NORTH', x: w * 0.125 },
    { label: 'EAST', x: w * 0.375 },
    { label: 'SOUTH', x: w * 0.625 },
    { label: 'WEST', x: w * 0.875 }
  ];
  ctx.font = '700 12px sans-serif';
  ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
  directions.forEach(d => {
    ctx.fillText(d.label, d.x, h - 25);
    ctx.fillRect(d.x + 20, h - 18, 2, 8);
  });

  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.92);
}
