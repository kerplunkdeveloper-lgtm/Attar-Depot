export type NotificationType =
  | 'order_placed'
  | 'payment_received'
  | 'customer_register'
  | 'customer_login'
  | 'stock_low'
  | 'stock_empty'
  | 'system';

export interface AdminNotification {
  _id: string;
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  customerName?: string;
  amount?: number;
  productName?: string;
  stockRemaining?: number;
  orderNumber?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent' | 'warning' | 'critical' | 'success';
  read?: boolean;
  isRead?: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Check and manage sound mute preferences in localStorage
export const getSoundMuted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('attar_admin_sound_muted') === 'true';
};

export const setSoundMuted = (muted: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('attar_admin_sound_muted', muted ? 'true' : 'false');
};

/**
 * High-End SaaS Notification Sound Engine (Synthesized via Web Audio API)
 * Zero external audio assets required; immune to 404s and playback buffering lags.
 */
export const playNotificationSound = (type: NotificationType | string = 'payment_received') => {
  if (typeof window === 'undefined') return;

  try {
    if (getSoundMuted()) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    const playHarmonicTone = (
      frequency: number,
      startTime: number,
      duration: number,
      peakGain: number,
      waveType: OscillatorType = 'sine'
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, startTime);

      // Natural acoustic envelope: fast attack, exponential decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    switch (type) {
      // 1. PAYMENT RECEIVED: Luxury Stripe / Shopify gold coin chime with crystal shimmer
      case 'payment_received': {
        // Fundamental tones
        playHarmonicTone(659.25, now, 0.45, 0.25, 'sine'); // E5
        playHarmonicTone(880.0, now + 0.08, 0.55, 0.32, 'triangle'); // A5
        playHarmonicTone(1318.51, now + 0.18, 0.7, 0.28, 'sine'); // E6
        // High sparkle harmonic
        playHarmonicTone(1760.0, now + 0.26, 0.85, 0.18, 'sine'); // A6
        break;
      }

      // 2. NEW ORDER PLACED: Warm dual bell chime
      case 'order_placed': {
        playHarmonicTone(523.25, now, 0.4, 0.25, 'triangle'); // C5
        playHarmonicTone(659.25, now + 0.12, 0.5, 0.28, 'sine'); // E5
        playHarmonicTone(783.99, now + 0.24, 0.65, 0.24, 'sine'); // G5
        break;
      }

      // 3. PRODUCT OUT OF STOCK (0 units): Urgent attention-grabbing double pulse
      case 'stock_empty': {
        // High alert minor interval pulse
        playHarmonicTone(880.0, now, 0.18, 0.35, 'sawtooth'); // A5
        playHarmonicTone(784.0, now + 0.15, 0.22, 0.35, 'sawtooth'); // G5
        playHarmonicTone(880.0, now + 0.32, 0.35, 0.38, 'triangle'); // A5 sustained
        break;
      }

      // 4. LOW STOCK WARNING (<= 5 units): Cautionary amber warning pulse
      case 'stock_low': {
        // Two cautionary notes (D5 -> F#5)
        playHarmonicTone(587.33, now, 0.22, 0.28, 'triangle'); // D5
        playHarmonicTone(739.99, now + 0.15, 0.4, 0.3, 'sine'); // F#5
        break;
      }

      // 5. CUSTOMER REGISTERED: Joyful welcoming ascending celebration arpeggio
      case 'customer_register': {
        playHarmonicTone(587.33, now, 0.3, 0.22, 'sine'); // D5
        playHarmonicTone(739.99, now + 0.1, 0.35, 0.26, 'sine'); // F#5
        playHarmonicTone(880.0, now + 0.2, 0.45, 0.28, 'sine'); // A5
        playHarmonicTone(1174.66, now + 0.32, 0.65, 0.24, 'sine'); // D6
        break;
      }

      // 6. CUSTOMER LOGIN: Subtle, modern pleasant confirmation blip (like Slack/Intercom)
      case 'customer_login': {
        playHarmonicTone(783.99, now, 0.15, 0.2, 'sine'); // G5
        playHarmonicTone(1046.5, now + 0.08, 0.28, 0.22, 'sine'); // C6
        break;
      }

      // Default fallback chime
      default: {
        playHarmonicTone(587.33, now, 0.35, 0.22, 'sine');
        playHarmonicTone(880.0, now + 0.12, 0.55, 0.28, 'sine');
        break;
      }
    }
  } catch (err) {
    console.warn('Unable to play audio notification chime:', err);
  }
};

// Backwards-compatible alias for existing imports
export const playOrderChime = () => playNotificationSound('payment_received');
