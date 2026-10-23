'use client';

import React from 'react';
import ContactHeroBanner from '@/components/contact/ContactHeroBanner';
import ContactHeader from '@/components/contact/ContactHeader';
import ContactDirectCards from '@/components/contact/ContactDirectCards';
import ContactStoreMap from '@/components/contact/ContactStoreMap';
import ContactSocialChannels from '@/components/contact/ContactSocialChannels';
import ContactFaqSection from '@/components/contact/ContactFaqSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] text-neutral-900 font-sans selection:bg-[#046A5A] selection:text-white pb-24">
      {/* 1. Hero Panoramic Banner & Breadcrumb Navigation */}
      <ContactHeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-8 relative z-20 space-y-12 sm:space-y-16">
        {/* 2. Official Perfumery Header & Status Pill */}
        <ContactHeader />

        {/* 3. One-Touch Direct Contact Action Cards */}
        <ContactDirectCards />

        {/* 4. Atelier & Flagship Boutique Location Map */}
        <ContactStoreMap />

        {/* 5. Official Social Media Channels (Find Us Around) */}
        <ContactSocialChannels />

        {/* 6. Frequently Asked Questions & Royal Scent Guidance */}
        <ContactFaqSection />
      </div>
    </div>
  );
}
