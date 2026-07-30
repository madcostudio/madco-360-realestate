import { getAbsoluteUrl } from '../utils/url';
import { INITIAL_PROPERTIES } from '../data/propertiesData';

export default function sitemap() {
  const staticRoutes = [
    '',
    '/properties',
    '/shoot-service',
    '/submit-listing',
  ].map(route => ({
    url: getAbsoluteUrl(route),
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const propertyRoutes = INITIAL_PROPERTIES.map(p => ({
    url: getAbsoluteUrl(`/property/${p.id}`),
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
