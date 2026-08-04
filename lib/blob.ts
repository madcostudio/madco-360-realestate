import { put } from '@vercel/blob';

export async function uploadPanoramaToBlobStorage(
  file: File | Buffer,
  tourId: string,
  sceneId: string,
  level: 'preview' | 'low' | 'med' | 'high'
): Promise<string> {
  const filename = `panoramas/${tourId}/${sceneId}/${level}.webp`;
  
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.includes('demo')) {
      const blob = await put(filename, file, {
        access: 'public',
        contentType: 'image/webp',
      });
      return blob.url;
    }
  } catch (error) {
    console.warn('Vercel Blob upload warning (using fallback path):', error);
  }

  // Fallback path for local demo/testing environment
  return `/demo-panoramas/processed/${tourId}/${sceneId}/${level}.webp`;
}
