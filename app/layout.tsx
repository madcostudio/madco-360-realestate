import type { Metadata } from 'next';
import { Inter, Playfair_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LocationProvider } from '@/lib/location-context';
import { LocationIpToast } from '@/components/location-ip-toast';
import { InteractiveCursor } from '@/components/interactive-cursor';
import { CinematicLoader } from '@/components/cinematic-loader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'Mad.co Estates — 360° Real Estate Marketplace',
  description: 'Explore 100% verified luxury penthouses and real estate across India with spherical 360° virtual walkthroughs.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://estates.madco.in'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning className="bg-[#060608] text-slate-900 min-h-screen flex flex-col antialiased selection:bg-sky-200 selection:text-sky-950 film-grain">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <LocationProvider>
          <CinematicLoader />
          <InteractiveCursor />
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
