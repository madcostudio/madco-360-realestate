const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '..', 'public', 'demo-panoramas');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createEquirectangularPano(name, roomTitle, mainColor, secondaryColor) {
  const width = 4096;
  const height = 2048;

  // Create SVG equirectangular panorama template
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Horizon 360 gradient -->
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0B1320"/>
        <stop offset="35%" stop-color="#1E293B"/>
        <stop offset="50%" stop-color="${secondaryColor}"/>
        <stop offset="65%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>

      <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${mainColor}"/>
        <stop offset="50%" stop-color="#D4AF37"/>
        <stop offset="100%" stop-color="${mainColor}"/>
      </linearGradient>
    </defs>

    <!-- Background Panorama Sky/Floor -->
    <rect width="${width}" height="${height}" fill="url(#skyGrad)"/>

    <!-- Grid lines representing equirectangular projection degrees -->
    <g stroke="rgba(255,255,255,0.08)" stroke-width="2">
      <!-- Pitch lines (Latitude) -->
      <line x1="0" y1="512" x2="${width}" y2="512"/>
      <line x1="0" y1="1024" x2="${width}" y2="1024" stroke="url(#accentGrad)" stroke-width="4"/>
      <line x1="0" y1="1536" x2="${width}" y2="1536"/>

      <!-- Yaw lines (Longitude - 0°, 90°, 180°, 270°, 360°) -->
      <line x1="0" y1="0" x2="0" y2="${height}"/>
      <line x1="1024" y1="0" x2="1024" y2="${height}"/>
      <line x1="2048" y1="0" x2="2048" y2="${height}"/>
      <line x1="3072" y1="0" x2="3072" y2="${height}"/>
      <line x1="4096" y1="0" x2="4096" y2="${height}"/>
    </g>

    <!-- Decorative Interior Walls / Windows / Architectural Features -->
    <!-- North Wall (0° Yaw) -->
    <rect x="300" y="600" width="1424" height="848" rx="20" fill="none" stroke="rgba(212,175,55,0.3)" stroke-width="6"/>
    <text x="1024" y="950" fill="#FAF9F5" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle">${roomTitle}</text>
    <text x="1024" y="1030" fill="#D4AF37" font-family="Arial, sans-serif" font-size="36" letter-spacing="4" text-anchor="middle">MADCO ESTATES 360° WALKTHROUGH</text>

    <!-- East Wall (90° Yaw = 1024px offset) -->
    <rect x="1324" y="700" width="1424" height="648" rx="15" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
    <text x="2048" y="980" fill="#E2E8F0" font-family="Arial, sans-serif" font-size="54" font-weight="600" text-anchor="middle">East Terrace View</text>
    <circle cx="2048" cy="1100" r="40" fill="none" stroke="#D4AF37" stroke-width="4"/>

    <!-- South Wall (180° Yaw = 2048px offset) -->
    <rect x="2348" y="600" width="1424" height="848" rx="20" fill="none" stroke="rgba(16,185,129,0.3)" stroke-width="6"/>
    <text x="3072" y="950" fill="#FAF9F5" font-family="Arial, sans-serif" font-size="64" font-weight="bold" text-anchor="middle">${roomTitle} - Lounge Zone</text>
    
    <!-- Compass markers at floor -->
    <text x="1024" y="1800" fill="#D4AF37" font-family="Arial, sans-serif" font-size="40" text-anchor="middle">NORTH [0°]</text>
    <text x="2048" y="1800" fill="#10B981" font-family="Arial, sans-serif" font-size="40" text-anchor="middle">EAST [90°]</text>
    <text x="3072" y="1800" fill="#D4AF37" font-family="Arial, sans-serif" font-size="40" text-anchor="middle">SOUTH [180°]</text>
  </svg>
  `;

  const filePath = path.join(outputDir, `${name}.jpg`);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(filePath);

  console.log(`Generated demo panorama: ${filePath}`);
}

async function main() {
  await createEquirectangularPano('living-room', 'Grand Living Room', '#D4AF37', '#1E293B');
  await createEquirectangularPano('kitchen', 'Gourmet Kitchen', '#10B981', '#334155');
  await createEquirectangularPano('bedroom', 'Master Bedroom Suite', '#6366F1', '#1E1B4B');
}

main().catch(console.error);
