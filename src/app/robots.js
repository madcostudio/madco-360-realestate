import { getAbsoluteUrl } from '../utils/url';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}
