/**
 * URL and Path Utilities for Mad.co Estates
 * Handles dynamic site URL resolution, canonical URLs, and basePath prefixes.
 */

export function getSiteUrl() {
  if (typeof window !== 'undefined' && window.location.origin) {
    return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://estates.madco.in';
}

export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

/**
 * Returns absolute URL for canonicals, sitemaps, Open Graph metadata
 */
export function getAbsoluteUrl(path = '') {
  const siteUrl = getSiteUrl().replace(/\/$/, '');
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${siteUrl}${basePath}${cleanPath}`;
}

/**
 * Returns relative path prefixed with basePath if configured
 */
export function getRelativePath(path = '') {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}

export const MADCO_AGENCY_URL = 'https://madco.in';
export const MADCO_WHATSAPP_URL = 'https://wa.me/918762640420';
