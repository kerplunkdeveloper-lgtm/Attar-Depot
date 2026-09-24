import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Poppins } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers/Providers';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import RouteProgressBar from '@/components/common/RouteProgressBar';


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
