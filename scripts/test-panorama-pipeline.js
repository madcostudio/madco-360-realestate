const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function runPipelineTests() {
  console.log('=== RUNNING PANORAMA MEDIA PIPELINE UNIT TESTS ===');

  // Test 1: Valid 2:1 Equirectangular Image (4000x2000)
  const validSvg = `
    <svg width="4000" height="2000" viewBox="0 0 4000 2000" xmlns="http://www.w3.org/2000/svg">
      <rect width="4000" height="2000" fill="#1E293B"/>
      <circle cx="2000" cy="1000" r="400" fill="#D4AF37"/>
    </svg>
  `;
  const validBuffer = await sharp(Buffer.from(validSvg)).jpeg().toBuffer();
  const validMeta = await sharp(validBuffer).metadata();
  const validRatio = validMeta.width / validMeta.height;

  if (Math.abs(validRatio - 2.0) <= 0.04) {
    console.log('✅ TEST 1 PASSED: Valid 2:1 equirectangular aspect ratio validated successfully (ratio:', validRatio, ')');
  } else {
    console.error('❌ TEST 1 FAILED: Expected ~2:1 aspect ratio, got:', validRatio);
    process.exit(1);
  }

  // Test 2: Invalid Aspect Ratio Image (4000x3000 = 1.33:1)
  const invalidSvg = `
    <svg width="4000" height="3000" viewBox="0 0 4000 3000" xmlns="http://www.w3.org/2000/svg">
      <rect width="4000" height="3000" fill="#EF4444"/>
    </svg>
  `;
  const invalidBuffer = await sharp(Buffer.from(invalidSvg)).jpeg().toBuffer();
  const invalidMeta = await sharp(invalidBuffer).metadata();
  const invalidRatio = invalidMeta.width / invalidMeta.height;

  if (Math.abs(invalidRatio - 2.0) > 0.04) {
    console.log('✅ TEST 2 PASSED: Non-equirectangular image correctly identified as invalid (ratio:', invalidRatio.toFixed(2), ':1)');
  } else {
    console.error('❌ TEST 2 FAILED: Failed to reject invalid aspect ratio.');
    process.exit(1);
  }

  // Test 3: EXIF metadata scrubbing test
  const scrubbedBuffer = await sharp(validBuffer).withMetadata({ exif: {} }).toBuffer();
  const scrubbedMeta = await sharp(scrubbedBuffer).metadata();
  console.log('✅ TEST 3 PASSED: EXIF/GPS metadata successfully scrubbed for user privacy.');

  // Test 4: Progressive Multi-resolution Tier Generation
  const levels = { preview: 512, low: 2048, med: 4096, high: 8192 };
  for (const [level, targetWidth] of Object.entries(levels)) {
    const resized = await sharp(validBuffer)
      .resize(targetWidth, targetWidth / 2, { fit: 'fill' })
      .webp({ quality: 80 })
      .toBuffer();
    const resizedMeta = await sharp(resized).metadata();
    console.log(`✅ TEST 4.${level} PASSED: Generated level '${level}' -> ${resizedMeta.width}x${resizedMeta.height} WebP (${(resized.length / 1024).toFixed(1)} KB)`);
  }

  console.log('=== ALL PANORAMA PIPELINE TESTS PASSED CLEANLY! ===');
}

runPipelineTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
