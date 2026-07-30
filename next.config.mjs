/** @type {import('next').NextStyle} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Configured to support both subdomain (estates.madco.in) and fallback subpath (madco.in/estates)
  basePath: basePath,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Ensure trailing slashes match SEO preferences
  trailingSlash: false,
};

export default nextConfig;
