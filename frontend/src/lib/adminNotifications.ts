export interface AdminNotification {
  id: string;
  type: 'order' | 'stock' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  orderNumber?: string;
  amount?: number;
  link?: string;
}

// Crisp dual-tone luxury SaaS notification chime synthesized via Web Audio API
export const playOrderChime = () => {
  if (typeof window === 'undefined') return;

  // Check user sound preference
  try {
    const isMuted = localStorage.getItem('attar_admin_sound_muted') === 'true';
    if (isMuted) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonic multi-tone SaaS chime (D5 -> A5 -> D6)
    const playNote = (frequency: number, startTime: number, duration: number, peakGain: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, startTime);

      // Smooth attack & decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // First tone (D5 ~ 587.33Hz)
    playNote(587.33, now, 0.35, 0.22);
    // Second tone (A5 ~ 880Hz)
    playNote(880.0, now + 0.12, 0.55, 0.28);
    // Royal shimmer high harmonic (D6 ~ 1174.66Hz)
    playNote(1174.66, now + 0.24, 0.75, 0.20);
  } catch (err) {
    console.warn('Unable to play audio notification chime:', err);
  }
};

export const getSoundMuted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('attar_admin_sound_muted') === 'true';
};

export const setSoundMuted = (muted: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('attar_admin_sound_muted', muted ? 'true' : 'false');
};
