import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900" suppressHydrationWarning>
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
    </div>
  );
}
