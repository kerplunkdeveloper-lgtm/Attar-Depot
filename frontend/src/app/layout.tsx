import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Poppins } from 'next/font/google';
import './globals.css';
import fs from 'node:fs';
import path from 'node:path';
import Providers from '@/components/providers/Providers';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import RouteProgressBar from '@/components/common/RouteProgressBar';

// Ensure texture.png and wood.png are available in public/images and public/
try {
  const source = path.join(process.cwd(), 'public', 'images', 'texture.png.jpeg');
  const target1 = path.join(process.cwd(), 'public', 'images', 'texture.png');
  const target2 = path.join(process.cwd(), 'public', 'texture.png');
  if (fs.existsSync(source)) {
    if (!fs.existsSync(target1)) fs.copyFileSync(source, target1);
    if (!fs.existsSync(target2)) fs.copyFileSync(source, target2);
  }

  const woodSource = path.join(process.cwd(), 'public', 'images', 'wood.jpeg');
  const woodTarget1 = path.join(process.cwd(), 'public', 'images', 'wood.png');
  const woodTarget2 = path.join(process.cwd(), 'public', 'wood.png');
  if (fs.existsSync(woodSource)) {
    if (!fs.existsSync(woodTarget1)) fs.copyFileSync(woodSource, woodTarget1);
    if (!fs.existsSync(woodTarget2)) fs.copyFileSync(woodSource, woodTarget2);
  }

  const aboutSource = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c0aa016-3e23-4537-bdb1-75cf85217467\\.user_uploaded\\media_1791018383377.png';
  const aboutTarget = path.join(process.cwd(), 'public', 'images', 'aboutbanner-new.png');
  if (fs.existsSync(aboutSource)) {
    fs.copyFileSync(aboutSource, aboutTarget);
  }

  const luxuryBannerSrc = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f30006dc-3c5d-4da6-804e-af994d6384c6\\about_luxury_hero_banner_1791023645913.jpg';
  const luxuryBannerTarget = path.join(process.cwd(), 'public', 'images', 'about-hero-banner.jpg');
  if (fs.existsSync(luxuryBannerSrc)) {
    fs.copyFileSync(luxuryBannerSrc, luxuryBannerTarget);
  }

  const fragranceSource = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f30006dc-3c5d-4da6-804e-af994d6384c6\\.user_uploaded\\media_1791020661201.png';
  const fragranceTarget1 = path.join(process.cwd(), 'public', 'images', 'fragrance-becomes.png');
  const fragranceTarget2 = path.join(process.cwd(), 'public', 'images', 'fragrance-becomes-bg.png');
  if (fs.existsSync(fragranceSource)) {
    fs.copyFileSync(fragranceSource, fragranceTarget1);
    fs.copyFileSync(fragranceSource, fragranceTarget2);
  }

  const ourvaluesSource = path.join(process.cwd(), 'public', 'images', 'ourvalues.png');
  const overvaluesTarget = path.join(process.cwd(), 'public', 'images', 'overvalues.png');
  if (fs.existsSync(ourvaluesSource)) {
    fs.copyFileSync(ourvaluesSource, overvaluesTarget);
  }

  const storefrontSrc = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f30006dc-3c5d-4da6-804e-af994d6384c6\\heritage_storefront_1972_1791022876342.jpg';
  const storefrontTarget = path.join(process.cwd(), 'public', 'images', 'heritage-storefront.jpg');
  if (fs.existsSync(storefrontSrc)) {
    fs.copyFileSync(storefrontSrc, storefrontTarget);
  }

  const parchmentSrc = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f30006dc-3c5d-4da6-804e-af994d6384c6\\heritage_parchment_bg_1791022915550.jpg';
  const parchmentTarget = path.join(process.cwd(), 'public', 'images', 'heritage-parchment-bg.jpg');
  if (fs.existsSync(parchmentSrc)) {
    fs.copyFileSync(parchmentSrc, parchmentTarget);
  }

  const refSrc = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f30006dc-3c5d-4da6-804e-af994d6384c6\\.user_uploaded\\media_1791022594950.png';
  const refTarget = path.join(process.cwd(), 'public', 'images', 'heritage-reference.png');
  if (fs.existsSync(refSrc)) {
    fs.copyFileSync(refSrc, refTarget);
  }

  const pondyJpeg = path.join(process.cwd(), 'public', 'images', 'pondy.jpeg');
  const pondyPng = path.join(process.cwd(), 'public', 'images', 'pondy.png');
  if (fs.existsSync(pondyJpeg)) {
    fs.copyFileSync(pondyJpeg, pondyPng);
  }
} catch (e) {
  // ignore
}


const SearchModal = dynamic(() => import('@/components/search/SearchModal'), {
  ssr: false,
});
const CartDrawer = dynamic(() => import('@/components/layout/CartDrawer'), {
  ssr: false,
});
const WishlistDrawer = dynamic(() => import('@/components/layout/WishlistDrawer'), {
  ssr: false,
});
const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), {
  ssr: false,
});
const ToastContainer = dynamic(
  () => import('@/components/common/ToastContainer'),
  { ssr: false }
);
const FloatingActionHub = dynamic(
  () => import('@/components/common/FloatingActionHub'),
  { ssr: false }
);
const AiChatDrawer = dynamic(() => import('@/components/ai/AiChatDrawer'), {
  ssr: false,
});
import Preloader from '@/components/common/Preloader';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Attar Depot | Pure Concentrated Essence of Royalty',
  description:
    'Discover 100% natural, alcohol-free pure attars, vintage aged Dehn Al Oudh, royal Kashmiri musk, and Kannauj distilled floral essences.',
  icons: {
    icon: '/images/favicon.ico',
  },
  keywords:
    'Attar, Dehn Al Oudh, Pure Perfume Oil, Kannauj Rose Attar, White Musk, Royal Fragrances, Alcohol Free Perfumes',
  openGraph: {
    title: 'Attar Depot | Pure Concentrated Essence of Royalty',
    description: 'Discover 100% natural, alcohol-free pure attars, vintage aged Dehn Al Oudh, royal Kashmiri musk, and Kannauj distilled floral essences.',
    url: 'https://attardepot.com',
    siteName: 'Attar Depot',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Attar Depot - Pure Concentrated Essence of Royalty',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attar Depot | Pure Concentrated Essence of Royalty',
    description: 'Discover 100% natural, alcohol-free pure attars, vintage aged Dehn Al Oudh, royal Kashmiri musk, and Kannauj distilled floral essences.',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`light scroll-smooth ${cormorant.variable} ${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-screen text-neutral-900 font-sans selection:bg-[#046A5A] selection:text-white antialiased`}
        suppressHydrationWarning
      >
        <Preloader />
        <Providers>
          {children}
          {/* Global application modals & floating interactive hubs */}
          <div id="overlays">
            <Suspense fallback={null}>
              <RouteProgressBar />
            </Suspense>
            <SearchModal />
            <CartDrawer />
            <WishlistDrawer />
            <AuthModal />
            <ToastContainer />
            <FloatingActionHub />
            <AiChatDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
