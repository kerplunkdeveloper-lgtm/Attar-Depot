'use client';

import React from 'react';
import { MapPin, Clock, ExternalLink, Navigation } from 'lucide-react';
import { SITE_CONTACT } from '@/config/siteContact';

export default function ContactStoreMap() {
  return (
    <section className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] space-y-6">
      {/* Header and Directions Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-50 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Puducherry Flagship Store</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            {SITE_CONTACT.address.puducherry.name}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {SITE_CONTACT.address.puducherry.fullAddress}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200">
            <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{SITE_CONTACT.operatingHours.display}</span>
          </div>
          <a
            href={SITE_CONTACT.maps.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#012520] hover:bg-[#023f36] text-[#FAF8F2] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#F5B418]" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* Interactive Google Map Embed */}
      <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-emerald-100 relative shadow-inner">
        <iframe
          src={SITE_CONTACT.maps.embedUrl}
          width="100%"
          height="100%"
          title="Attar Depot Flagship Store Map"
          style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
