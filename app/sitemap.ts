import { MetadataRoute } from 'next';
import { DEMO_PROPERTIES_LIST } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madcoestates.com';

  const propertyEntries = DEMO_PROPERTIES_LIST.map((prop) => ({
    url: `${baseUrl}/property/${prop.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const tourEntries = DEMO_PROPERTIES_LIST.map((prop) => ({
    url: `${baseUrl}/property/${prop.slug}/tour`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const cityEntries = ['mumbai', 'bengaluru', 'delhi', 'hyderabad'].map((city) => ({
    url: `${baseUrl}/homes-in-${city}`,
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
