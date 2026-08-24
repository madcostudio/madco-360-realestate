const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19"/>
      <stop offset="100%" stop-color="#060608"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#0EA5E9" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#6366F1" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="blueE" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#0EA5E9" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Tile -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)" />
  <rect x="16" y="16" width="480" height="480" rx="108" stroke="url(#borderGrad)" stroke-width="14" />

  <!-- ME Text Lockup -->
  <g filter="url(#glow)">
    <!-- M in crisp white -->
    <text x="110" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Space Grotesk', sans-serif" font-size="240" font-weight="900" fill="#FFFFFF" letter-spacing="-6">M</text>
    <!-- E in electric blue -->
    <text x="290" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Space Grotesk', sans-serif" font-size="240" font-weight="900" fill="url(#blueE)" letter-spacing="-6">E</text>
  </g>
</svg>
`;

async function generateFavicons() {
  const rootDir = path.resolve(__dirname, '..');
  const svgBuffer = Buffer.from(svgIcon.trim());

  // Save public/favicon.svg
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), svgIcon.trim());
  console.log('Generated public/favicon.svg');

  // Save app/icon.png (512x512 and 64x64)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(rootDir, 'app', 'icon.png'));
  console.log('Generated app/icon.png');

  // Save public/apple-touch-icon.png
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(rootDir, 'public', 'apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // Save public/favicon-32x32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(rootDir, 'public', 'favicon-32x32.png'));
  console.log('Generated public/favicon-32x32.png');
}

generateFavicons().catch(console.error);
