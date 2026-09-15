import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Poppins } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers/Providers';
import CartDrawer from '@/components/layout/CartDrawer';
import AuthModal from '@/components/auth/AuthModal';
import SearchModal from '@/components/search/SearchModal';
import ToastContainer from '@/components/common/ToastContainer';
import FloatingActionHub from '@/components/common/FloatingActionHub';
import AiChatDrawer from '@/components/ai/AiChatDrawer';

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
  keywords:
    'Attar, Dehn Al Oudh, Pure Perfume Oil, Kannauj Rose Attar, White Musk, Royal Fragrances, Alcohol Free Perfumes',
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
        className={`${inter.className} min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#046A5A] selection:text-white antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <SearchModal />
          <CartDrawer />
          <AuthModal />
          <ToastContainer />
          <FloatingActionHub />
          <AiChatDrawer />
        </Providers>
      </body>
    </html>
  );
}
