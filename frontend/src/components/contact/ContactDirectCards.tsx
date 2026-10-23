'use client';

import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { SITE_CONTACT } from '@/config/siteContact';
import { toast } from '@/lib/toast';

export default function ContactDirectCards() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} copied to clipboard!`, { title: 'Copied' });
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2200);
    }
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: WhatsApp Concierge */}
        <div className="group bg-white/80 backdrop-blur-md border border-emerald-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Instant Desk
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide font-serif">WhatsApp Desk</p>
              <h3 className="text-base font-bold text-neutral-900 mt-0.5">VIP Fragrance Concierge</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Personal scent recommendations, flacon video previews &amp; direct order tracking.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
            <a
              href={SITE_CONTACT.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1fa951] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Chat Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => handleCopy(SITE_CONTACT.whatsapp.display, 'wa', 'WhatsApp number')}
              title="Copy WhatsApp number"
              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
            >
              {copiedKey === 'wa' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card 2: Voice Hotline */}
        <div className="group bg-white/80 backdrop-blur-md border border-amber-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#012520] text-[#F5B418] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                Voice Call
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#012520] uppercase tracking-wide font-serif">Direct Hotline</p>
              <h3 className="text-base font-bold text-neutral-900 mt-0.5">{SITE_CONTACT.phone.display}</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Speak directly with our Master Perfumer desk for custom flacons and formulation details.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
            <a
              href={SITE_CONTACT.phone.telUrl}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#012520] hover:bg-[#023f36] text-[#FAF8F2] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Call Hotline</span>
              <Phone className="w-3.5 h-3.5 text-[#F5B418]" />
            </a>
            <button
              type="button"
              onClick={() => handleCopy(SITE_CONTACT.phone.display, 'phone', 'Phone number')}
              title="Copy phone number"
              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
            >
              {copiedKey === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card 3: VIP Email */}
        <div className="group bg-white/80 backdrop-blur-md border border-sky-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-sky-500 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-900 border border-sky-200">
                Inquiries
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-sky-700 uppercase tracking-wide font-serif">Concierge Mail</p>
              <h3 className="text-base font-bold text-neutral-900 mt-0.5 truncate">{SITE_CONTACT.email.primary}</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Corporate gifting, wedding trousseaus, private label distillation &amp; bulk orders.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
            <a
              href={SITE_CONTACT.email.mailtoUrl}
              className="flex-1 py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Send Email</span>
              <Mail className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => handleCopy(SITE_CONTACT.email.primary, 'mail', 'Email address')}
              title="Copy email address"
              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
            >
              {copiedKey === 'mail' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card 4: Flagship Store */}
        <div className="group bg-white/80 backdrop-blur-md border border-purple-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#046A5A] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-[#F5B418]" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                Puducherry
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#046A5A] uppercase tracking-wide font-serif">Flagship Store</p>
              <h3 className="text-base font-bold text-neutral-900 mt-0.5">Bharathi Street Boutique</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Experience sensory perfume sampling, custom decanting &amp; pure Kannauj attars in store.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
            <a
              href={SITE_CONTACT.maps.queryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#046A5A] hover:bg-[#035346] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>View Map</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F5B418]" />
            </a>
            <button
              type="button"
              onClick={() => handleCopy(SITE_CONTACT.address.puducherry.fullAddress, 'loc', 'Boutique address')}
              title="Copy boutique address"
              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
            >
              {copiedKey === 'loc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
