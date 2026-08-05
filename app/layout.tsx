import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LocationProvider } from '@/lib/location-context';
import { LocationIpToast } from '@/components/location-ip-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Mad.co Estates — 360° Real Estate Marketplace',
  description: 'Explore 100% verified luxury penthouses and real estate across India with spherical 360° virtual walkthroughs.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://estates.madco.in'),
  openGraph: {
    title: 'Mad.co Estates — 360° Real Estate Marketplace',
    description: 'Immersive spherical walkthroughs of verified luxury homes across India.',
    siteName: 'Mad.co Estates',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-ink-950 text-text-hi min-h-screen flex flex-col antialiased selection:bg-brass selection:text-ink-950">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <LocationProvider>
          <Navbar />
          <div id="main-content" className="flex-1">
            {children}
          </div>
          <LocationIpToast />
          <Footer />
        </LocationProvider>
      </body>
    </html>
  );
}

