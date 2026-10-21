/**
 * =========================================================================
 * ATTAR DEPOT - CENTRALIZED CONTACT & SOCIAL MEDIA CONFIGURATION
 * =========================================================================
 * SINGLE SOURCE OF TRUTH (SSOT) FOR:
 * - Phone numbers & Hotline
 * - WhatsApp Concierge number & prefilled messages
 * - Email addresses (Support, VIP concierge, wholesale)
 * - Flagship Perfumery & Distillery addresses
 * - Google Maps interactive links & embed URLs
 * - Official Social Media channels (Instagram, WhatsApp, YouTube, Facebook, X, Telegram)
 * - Operating hours & Customer support availability
 *
 * Any change made here automatically propagates to:
 * 1. Footer.tsx
 * 2. Navbar.tsx
 * 3. FloatingActionHub.tsx
 * 4. /contact page
 * 5. /social (Social Media & Connect Hub) page
 * 6. OrderConfirmedView.tsx and other customer touchpoints
 * =========================================================================
 */

export interface SocialLinkItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  description: string;
  badge: string;
  brandColor: string;
  gradient?: string;
  iconName: 'instagram' | 'whatsapp' | 'youtube' | 'facebook' | 'twitter' | 'telegram' | 'linkedin';
}

export const SITE_CONTACT = {
  // Brand Identity
  brandName: 'The Attar Depot',
  tagline: 'Pure Concentrated Essence of Royalty • Kannauj Traditional Distillation',

  // Phone / Voice Hotline
  phone: {
    display: '+91 98765 43210',
    international: '+919876543210',
    national: '098765 43210',
    telUrl: 'tel:+919876543210',
    label: 'Master Perfumer Concierge Hotline',
    subtext: 'Direct Voice Assistance • Mon-Sat 10 AM - 9 PM IST',
  },

  // WhatsApp Concierge Desk
  whatsapp: {
    display: '+91 98765 43210',
    rawNumber: '919876543210',
    defaultMessage: 'Salam & Greetings! I am inquiring about Attar Depot pure perfume oils and bespoke royal fragrances.',
    orderMessage: 'Hello Attar Depot Team, I would like to place an order or inquire about my shipment.',
    corporateMessage: 'Hello, I am interested in corporate gifting, wedding favors, and bespoke fragrance flacons.',
    get url() {
      return `https://wa.me/${this.rawNumber}?text=${encodeURIComponent(this.defaultMessage)}`;
    },
    getOrderUrl(orderNumber?: string) {
      const msg = orderNumber
        ? `Hello Attar Depot, I am inquiring about my Order #${orderNumber}.`
        : this.orderMessage;
      return `https://wa.me/${this.rawNumber}?text=${encodeURIComponent(msg)}`;
    },
    getCustomUrl(customMessage: string) {
      return `https://wa.me/${this.rawNumber}?text=${encodeURIComponent(customMessage)}`;
    },
    label: 'WhatsApp VIP Concierge',
    subtext: 'Live Bottle Previews, Scent Layering Guidance & Fast Checkout',
  },

  // Email Desks
  email: {
    primary: 'concierge@attardepot.com',
    concierge: 'concierge@attardepot.com',
    support: 'support@attardepot.com',
    orders: 'orders@attardepot.com',
    wholesale: 'wholesale@attardepot.com',
    get mailtoUrl() {
      return `mailto:${this.primary}?subject=${encodeURIComponent('Inquiry: Pure Royal Attars')}`;
    },
    getSupportMailtoUrl(subject?: string) {
      return `mailto:${this.support}?subject=${encodeURIComponent(subject || 'Customer Support Request')}`;
    },
  },

  // Alias getter for backward compatibility
  get emails() {
    return this.email;
  },

  // Physical Flagship & Distillery Locations
  address: {
    puducherry: {
      name: 'Attar Depot Flagship Store',
      street: 'Bharathi Street, MG Road',
      city: 'Puducherry',
      state: 'Puducherry',
      country: 'India',
      pincode: '605001',
      fullAddress: 'Bharathi Street, MG Road, Puducherry, India - 605001',
      mapUrl: 'https://www.google.com/maps/place/The+Attar+Depot+(Opening+Soon)/@11.9352508,79.8272356,17z/data=!4m15!1m8!3m7!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!2sThe+Attar+Depot+(Opening+Soon)!8m2!3d11.9352508!4d79.8272356!10e1!16s%2Fg%2F11nk011rzr!3m5!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!8m2!3d11.9352508!4d79.8272356!16s%2Fg%2F11nk011rzr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.5661658908084!2d79.8272356!3d11.935250799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361321e7067c7%3A0x21cfed5a9498e2a5!2sThe%20Attar%20Depot%20(Opening%20Soon)!5e0!3m2!1sen!2sin!4v1790573624309!5m2!1sen!2sin',
    },
    flagship: {
      name: 'Kannauj Master Distillery & Heritage Works',
      street: 'Heritage Perfume Lane, Near Jama Masjid',
      city: 'Kannauj',
      state: 'Uttar Pradesh',
      country: 'India',
      pincode: '209725',
      fullAddress: 'Heritage Perfume Lane, Near Jama Masjid, Kannauj, Uttar Pradesh, India - 209725',
    },
    mumbaiBoutique: {
      name: 'Mumbai Royal Boutique & Experience Studio',
      street: 'Fort Heritage Precinct, Near Kala Ghoda',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      fullAddress: 'Fort Heritage Precinct, Near Kala Ghoda, Mumbai, Maharashtra, India - 400001',
    },
  },

  // Google Maps Links & Coordinates
  maps: {
    title: 'Attar Depot Flagship Store (Puducherry)',
    queryUrl: 'https://www.google.com/maps/place/The+Attar+Depot+(Opening+Soon)/@11.9352508,79.8272356,17z/data=!4m15!1m8!3m7!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!2sThe+Attar+Depot+(Opening+Soon)!8m2!3d11.9352508!4d79.8272356!10e1!16s%2Fg%2F11nk011rzr!3m5!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!8m2!3d11.9352508!4d79.8272356!16s%2Fg%2F11nk011rzr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=The+Attar+Depot+Bharathi+Street+Puducherry+India',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.5661658908084!2d79.8272356!3d11.935250799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361321e7067c7%3A0x21cfed5a9498e2a5!2sThe%20Attar%20Depot%20(Opening%20Soon)!5e0!3m2!1sen!2sin!4v1790573624309!5m2!1sen!2sin',
    label: 'Open in Google Maps',
  },

  // Operating Schedule
  operatingHours: {
    workingDays: 'Monday to Saturday',
    timing: '10:00 AM - 9:00 PM IST',
    sunday: 'Sunday: Virtual Concierge & Online Orders Dispatched',
    display: 'Mon - Sat: 10:00 AM - 9:00 PM IST',
    statusPill: 'Desk Active Today',
  },

  // Official Social Media Channels (with icons, links, handles, branding)
  socials: {
    instagram: {
      id: 'instagram',
      name: 'Instagram',
      handle: '@theattardepot',
      url: 'https://www.instagram.com/theattardepot',
      description: 'Daily Deg-Bhapka distillation reels, flacon aesthetics, customer unboxings & accord layering tutorials.',
      badge: 'Daily Reels',
      brandColor: '#E4405F',
      gradient: 'from-[#FD1D1D] via-[#E4405F] to-[#833AB4]',
      iconName: 'instagram',
    } as SocialLinkItem,

    whatsapp: {
      id: 'whatsapp',
      name: 'WhatsApp Concierge',
      handle: '+91 98765 43210',
      url: 'https://wa.me/919876543210?text=Salam%20%26%20Greetings!%20I%20am%20inquiring%20about%20Attar%20Depot%20pure%20perfume%20oils.',
      description: 'Instant bespoke recommendations from our Master Perfumers, live bottle video previews & VIP ordering.',
      badge: 'Active Desk',
      brandColor: '#25D366',
      gradient: 'from-[#25D366] to-[#128C7E]',
      iconName: 'whatsapp',
    } as SocialLinkItem,

    youtube: {
      id: 'youtube',
      name: 'YouTube',
      handle: '@theattardepot',
      url: 'https://www.youtube.com/@theattardepot',
      description: '4K cinematic documentaries on ancient copper hydro-distillation, aged Assam Dehn Al Oudh & fragrance secrets.',
      badge: '4K Films',
      brandColor: '#FF0000',
      gradient: 'from-[#FF0000] to-[#CC0000]',
      iconName: 'youtube',
    } as SocialLinkItem,

    facebook: {
      id: 'facebook',
      name: 'Facebook',
      handle: 'theattardepot',
      url: 'https://www.facebook.com/theattardepot',
      description: 'Join thousands of fragrance collectors discussing traditional notes, longevity preservation & heritage history.',
      badge: 'Community',
      brandColor: '#1877F2',
      gradient: 'from-[#1877F2] to-[#0D65D9]',
      iconName: 'facebook',
    } as SocialLinkItem,

    twitter: {
      id: 'twitter',
      name: 'X (Twitter)',
      handle: '@attardepot',
      url: 'https://twitter.com/attardepot',
      description: 'Live batch releases, rare vintage oudh availability alerts & announcements from our master distillation house.',
      badge: 'Official',
      brandColor: '#000000',
      gradient: 'from-[#1E293B] to-[#0F172A]',
      iconName: 'twitter',
    } as SocialLinkItem,

    telegram: {
      id: 'telegram',
      name: 'Telegram VIP Club',
      handle: '@attardepot_vip',
      url: 'https://t.me/attardepot_vip',
      description: 'Exclusive first access to limited 12-year aged Dehn Al Oudh flacons and private vault reserve attars.',
      badge: 'VIP Club',
      brandColor: '#229ED9',
      gradient: 'from-[#229ED9] to-[#1E88E5]',
      iconName: 'telegram',
    } as SocialLinkItem,
  },

  // Array format helper for easy list rendering
  get socialList(): SocialLinkItem[] {
    return [
      this.socials.instagram,
      this.socials.whatsapp,
      this.socials.youtube,
      this.socials.facebook,
      this.socials.twitter,
      this.socials.telegram,
    ];
  },
};
