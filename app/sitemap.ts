import { MetadataRoute } from 'next';
import { getPublishedProperties } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://estates.madco.in';

  let properties: Array<{ slug: string; updated_at?: string; city?: string }> = [];
  try {
    properties = await getPublishedProperties();
  } catch (err) {
    console.warn('Sitemap query error:', err);
  }

  const propertyEntries = properties.map((prop) => ({
    url: `${baseUrl}/property/${prop.slug}`,
    lastModified: prop.updated_at ? new Date(prop.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const tourEntries = properties.map((prop) => ({
    url: `${baseUrl}/property/${prop.slug}/tour`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const distinctCities = Array.from(
    new Set(properties.map((p) => (p.city || '').toLowerCase().trim()).filter(Boolean))
  );

  const cityEntries = distinctCities.map((city) => ({
    url: `${baseUrl}/homes-in-${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...cityEntries,
    ...propertyEntries,
    ...tourEntries,
  ];
}

