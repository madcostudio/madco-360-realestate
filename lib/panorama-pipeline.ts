import sharp from 'sharp';
import { uploadPanoramaToBlobStorage } from '@/lib/blob';

export interface PanoramaLevels {
  preview: string;
  low: string;
  med: string;
  high: string;
}

export async function processPanorama(
  fileOrBuffer: File | Buffer | ArrayBuffer,
  tourId: string,
  sceneId: string
): Promise<PanoramaLevels> {
  let buffer: Buffer;

  if (fileOrBuffer instanceof ArrayBuffer) {
    buffer = Buffer.from(fileOrBuffer);
  } else if (typeof File !== 'undefined' && fileOrBuffer instanceof File) {
    const arrayBuf = await fileOrBuffer.arrayBuffer();
    buffer = Buffer.from(arrayBuf);
  } else if (Buffer.isBuffer(fileOrBuffer)) {
    buffer = fileOrBuffer;
  } else {
    throw new Error('Invalid input file format for panorama processing.');
  }

  // Validate equirectangular aspect ratio (2:1 aspect ratio, allow ±2% tolerance)
  const image = sharp(buffer);
  const meta = await image.metadata();
  
  if (!meta.width || !meta.height) {
    throw new Error('Could not read image metadata.');
  }

  const aspectRatio = meta.width / meta.height;
  if (Math.abs(aspectRatio - 2.0) > 0.04) {
    throw new Error(
      `Invalid equirectangular aspect ratio (${aspectRatio.toFixed(2)}:1). Expected ~2:1 (e.g. 6000x3000px).`
    );
  }

  // Strip EXIF / GPS metadata for privacy
  const cleanImage = sharp(buffer).withMetadata({ exif: {} });

  const targetWidths = {
    preview: 512,
    low: 2048,
    med: 4096,
    high: Math.min(8192, meta.width),
  };

  const levels: Record<string, string> = {};

  for (const [level, width] of Object.entries(targetWidths)) {
    const height = Math.round(width / 2);
    
    const webpBuffer = await cleanImage
      .clone()
      .resize(width, height, { fit: 'fill' })
      .webp({ quality: 80 })
      .toBuffer();

    const levelKey = level as keyof PanoramaLevels;
    levels[levelKey] = await uploadPanoramaToBlobStorage(webpBuffer, tourId, sceneId, levelKey);
  }

  return levels as unknown as PanoramaLevels;
}
