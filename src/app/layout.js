import '../index.css';
import Footer from '../components/Footer';
import { getAbsoluteUrl, getSiteUrl } from '../utils/url';

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Mad.co 360° Real Estate — Walk through your next home before you ever step inside it',
  description: 'Mangalore\'s premier verified 360° spatial real estate portal by Mad.co Studio. Explore flats, villas, houses, and plots with interactive 360 virtual walkthroughs.',
  keywords: ['Mangalore Real Estate', '360 Virtual Tour', 'Mad.co Studio', 'Flats for sale Mangalore', 'Villas Mangalore', '360 Walkthrough'],
  authors: [{ name: 'Mad.co Spatial Marketing Studio', url: 'https://madco.in' }],
  openGraph: {
    title: 'Mad.co 360° Real Estate — Walk through your next home before you ever step inside it',
    description: 'Explore verified residential real estate in Mangalore with room-to-room 360° VR spatial walkthroughs.',
    url: getAbsoluteUrl('/'),
    siteName: 'Mad.co 360° Real Estate',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Mad.co 360 Spatial Walkthrough',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mad.co 360° Real Estate — Mangalore',
    description: 'Walk through your next home before you ever step inside it.',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: getAbsoluteUrl('/'),
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
        {children}
        <Footer />
      </body>
    </html>
  );
}
