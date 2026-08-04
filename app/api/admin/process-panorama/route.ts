import { NextRequest, NextResponse } from 'next/server';
import { processPanorama } from '@/lib/panorama-pipeline';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tourId = formData.get('tourId') as string;
    const sceneId = formData.get('sceneId') as string;

    if (!file || !tourId || !sceneId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const levels = await processPanorama(file, tourId, sceneId);
    return NextResponse.json({ levels });
  } catch (error: any) {
    console.error('Error processing panorama:', error);
    return NextResponse.json({ error: error.message || 'Processing failed' }, { status: 500 });
  }
}
