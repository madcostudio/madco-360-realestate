import { PropertyData } from './mock-data';

export function generateListingJsonLd(property: PropertyData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madcoestates.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${baseUrl}/property/${property.slug}`,
    image: property.cover_image,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressCountry: 'IN',
    },
  };
}

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://madcoestates.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mad.co Estates',
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    sameAs: ['https://madco.in'],
  };
}
