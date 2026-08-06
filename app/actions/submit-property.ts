'use server';

import { createClient } from '@/lib/supabase/server';

export interface SubmitPropertyResult {
  success: boolean;
  propertyId?: string;
  slug?: string;
  error?: string;
}

export async function submitPropertyAction(formData: FormData): Promise<SubmitPropertyResult> {
  try {
    const supabase = createClient();

    const title = formData.get('title') as string;
    const priceStr = formData.get('price') as string;
    const bhkStr = formData.get('bhk') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const locality = (formData.get('locality') as string) || address.split(',')[0] || city;
    const description = (formData.get('description') as string) || '';
    const rawExternalTourUrl = (formData.get('externalTourUrl') as string || '').trim();
    const requestMadcoCapture = formData.get('requestMadcoCapture') === 'true';

    let externalTourUrl: string | null = null;
    let externalTourProvider: string | null = null;

    if (rawExternalTourUrl) {
      if (!rawExternalTourUrl.startsWith('https://')) {
        return { success: false, error: '360° Tour Link must be a valid secure URL starting with https://' };
      }
      try {
        const parsed = new URL(rawExternalTourUrl);
        externalTourUrl = parsed.toString();
        const host = parsed.hostname.toLowerCase();
        if (host.includes('pano.cool')) externalTourProvider = 'panocool';
        else if (host.includes('kuula')) externalTourProvider = 'kuula';
        else if (host.includes('matterport')) externalTourProvider = 'matterport';
        else externalTourProvider = 'external';
      } catch (urlErr) {
        return { success: false, error: 'Invalid 360° Tour Link URL format.' };
      }
    }

    const coverFile = formData.get('coverFile') as File | null;
    const panoFile = formData.get('panoFile') as File | null;

    if (!title || !priceStr || !bhkStr || !address || !city) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const price = parseInt(priceStr, 10);
    const bhk = parseInt(bhkStr, 10);

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    let coverImageUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';

    // 1. Upload Cover Image to property-media bucket if provided
    if (coverFile && coverFile.size > 0) {
      const fileExt = coverFile.name.split('.').pop() || 'jpg';
      const filePath = `covers/${slug}-${Date.now()}.${fileExt}`;
      const arrayBuffer = await coverFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('property-media')
        .upload(filePath, buffer, {
          contentType: coverFile.type || 'image/jpeg',
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('property-media')
          .getPublicUrl(uploadData.path);
        if (publicUrlData?.publicUrl) {
          coverImageUrl = publicUrlData.publicUrl;
        }
      } else if (uploadErr) {
        console.warn('Cover image upload warning:', uploadErr.message);
      }
    }

    // 2. Upload optional 360° Panorama to capture-uploads private bucket
    let rawPanoPath: string | null = null;
    if (panoFile && panoFile.size > 0) {
      const fileExt = panoFile.name.split('.').pop() || 'jpg';
      const filePath = `raw-panos/${slug}-${Date.now()}.${fileExt}`;
      const arrayBuffer = await panoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: panoData, error: panoErr } = await supabase.storage
        .from('capture-uploads')
        .upload(filePath, buffer, {
          contentType: panoFile.type || 'image/jpeg',
          upsert: true,
        });

      if (!panoErr && panoData) {
        rawPanoPath = panoData.path;
      } else if (panoErr) {
        console.warn('Panorama upload warning:', panoErr.message);
      }
    }

    // City center approximations for coordinates
    let lat = 19.0760;
    let lng = 72.8777;
    if (city.toLowerCase().includes('mangalore')) {
      lat = 12.9141;
      lng = 74.8560;
    } else if (city.toLowerCase().includes('bengaluru') || city.toLowerCase().includes('bangalore')) {
      lat = 12.9716;
      lng = 77.5946;
    } else if (city.toLowerCase().includes('goa')) {
      lat = 15.2993;
      lng = 74.1240;
    }

    // 3. Insert Property Record into public.properties
    const propertyId = crypto.randomUUID();
    const { data: propData, error: propErr } = await supabase
      .from('properties')
      .insert({
        id: propertyId,
        title,
        slug,
        price,
        bhk,
        address,
        city,
        locality,
        description,
        status: 'pending',
        cover_image: coverImageUrl,
        external_tour_url: externalTourUrl,
        external_tour_provider: externalTourProvider,
        lat,
        lng,
        featured: false,
      })
      .select()
      .single();

    if (propErr) {
      console.error('Error inserting property to Supabase:', propErr);
      return { success: false, error: propErr.message };
    }

    // 4. Record Capture Request if checked and table exists
    if (requestMadcoCapture) {
      try {
        await supabase.from('capture_requests').insert({
          id: crypto.randomUUID(),
          property_id: propertyId,
          preferred_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          status: 'pending',
          raw_pano_path: rawPanoPath,
          notes: `Owner requested professional 360 capture visit for "${title}".`,
        });
      } catch (reqErr) {
        // Optional table, logged safely without failing the submission
      }
    }

    return {
      success: true,
      propertyId: propData.id,
      slug: propData.slug,
    };
  } catch (err: any) {
    console.error('Submit property action error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
