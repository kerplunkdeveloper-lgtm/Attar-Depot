'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Preload logo assets immediately into browser memory for zero-lag instant rendering
  useEffect(() => {
    const textImg = new window.Image();
    textImg.src = '/images/attar-logo-text.png';
    const iconImg = new window.Image();
    iconImg.src = '/images/attar-logo-icon.png';
  }, []);

  // Organic physics-based liquid fill loading curve (0% -> 100%) applied specifically to the logo icon
  useEffect(() => {
    const targetDuration = prefersReducedMotion ? 900 : 2200; // ms

    const updateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progressFraction = Math.min(elapsed / targetDuration, 1);

      // Smooth organic cubic easing: gentle rise, buoyant glide, elegant deceleration
      const eased =
        progressFraction < 0.5
          ? 4 * progressFraction * progressFraction * progressFraction
          : 1 - Math.pow(-2 * progressFraction + 2, 3) / 2;

      const currentPercent = Math.min(100, Math.max(0, eased * 100));
      setProgress(currentPercent);

      if (progressFraction < 1) {
        rafRef.current = requestAnimationFrame(updateProgress);
      } else {
        // Hold briefly at 100% so user sees the fully illuminated golden flame icon
        const exitTimer = setTimeout(() => {
          setIsLoading(false);
        }, 320);
        return () => clearTimeout(exitTimer);
      }
    };

    rafRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  // Safety fallback timeout to guarantee dismissal under any network or backgrounding state
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(safetyTimer);
  }, []);

  // Keyboard shortcut (Escape) to skip preloader instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProgress(100);
        setIsLoading(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkip = () => {
    setProgress(100);
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="attar-icon-fill-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.025,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none bg-[#01140E] cursor-pointer"
          onClick={handleSkip}
          title="Click to enter"
          role="dialog"
          aria-label="Loading Attar Depot"
        >
          {/* ============================================================== */}
          {/* CSS KEYFRAMES & MICRO-ANIMATIONS                               */}
          {/* ============================================================== */}
          <style jsx>{`
            /* Meniscus horizontal beam sweep & ripple on the filling icon */
            @keyframes meniscusPulse {
              0%, 100% {
                opacity: 0.8;
                transform: translateY(-50%) scaleY(1);
              }
              50% {
                opacity: 1;
                transform: translateY(-50%) scaleY(1.4);
              }
            }

            /* Golden shimmer wave traveling across filled icon surface */
            @keyframes goldShimmer {
              0% {
                transform: translateX(-150%) skewX(-16deg);
                opacity: 0;
              }
              30%, 70% {
                opacity: 0.45;
              }
              100% {
                transform: translateX(180%) skewX(-16deg);
                opacity: 0;
              }
            }

            /* Ambient backlight breathing */
            @keyframes auraBreathe {
              0%, 100% {
                transform: translate(-50%, -50%) scale(0.95);
                opacity: 0.35;
              }
              50% {
                transform: translate(-50%, -50%) scale(1.08);
                opacity: 0.65;
              }
            }

            /* Elegant Staggered Loading Dots Fade (Reference Image UX) */
            @keyframes dotFade1 {
              0%, 20% { opacity: 0; transform: translateY(0); }
              40%, 80% { opacity: 1; transform: translateY(-1.5px); }
              100% { opacity: 0; transform: translateY(0); }
            }
            @keyframes dotFade2 {
              0%, 40% { opacity: 0; transform: translateY(0); }
              60%, 80% { opacity: 1; transform: translateY(-1.5px); }
              100% { opacity: 0; transform: translateY(0); }
            }
            @keyframes dotFade3 {
              0%, 60% { opacity: 0; transform: translateY(0); }
              80%, 100% { opacity: 1; transform: translateY(-1.5px); }
            }

            .animate-dot-1 {
              animation: dotFade1 1.5s ease-in-out infinite;
            }
            .animate-dot-2 {
              animation: dotFade2 1.5s ease-in-out infinite;
            }
            .animate-dot-3 {
              animation: dotFade3 1.5s ease-in-out infinite;
            }
          `}</style>

          {/* ============================================================== */}
          {/* 1. DEEP ROYAL EMERALD VIGNETTE BACKGROUND                       */}
          {/* ============================================================== */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, #064838 0%, #01261D 55%, #000B08 100%)',
            }}
          />

          {/* Central Backlight Golden Corona behind the Logo */}
          <div
            className="absolute top-1/2 left-1/2 w-[300px] h-[260px] sm:w-[440px] sm:h-[340px] md:w-[540px] md:h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,180,24,0.20)_0%,rgba(4,106,90,0.15)_50%,transparent_75%)] blur-3xl pointer-events-none"
            style={{
              animation: prefersReducedMotion ? 'none' : 'auraBreathe 3.2s ease-in-out infinite',
              willChange: 'transform, opacity',
            }}
          />

          {/* ============================================================== */}
          {/* 2. LOGO: STATIC GOLD BRAND TEXT + SPECIFIC ICON LIQUID FILL   */}
          {/* ============================================================== */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 w-full">
            {/* Logo Container with exact aspect ratio of the brand master logo (1690 x 931) */}
            <div className="relative w-[280px] min-[400px]:w-[330px] sm:w-[390px] md:w-[450px] lg:w-[490px] max-w-[92vw] aspect-[1690/931] flex items-center justify-center">
              
              {/* ------------------------------------------------------------ */}
              {/* STATIC GOLD BRAND TEXT: "THE" (Left) and "ATTAR DEPOT" (Right) */}
              {/* Sourced from attar-logo-text.png (Center icon is transparent) */}
              {/* Stays perfectly static, razor-sharp, and unclipped            */}
              {/* ------------------------------------------------------------ */}
              <img
                src="/images/attar-logo-text.png"
                alt="The Attar Depot"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_2px_14px_rgba(245,180,24,0.4)]"
              />

              {/* ------------------------------------------------------------ */}
              {/* CENTRAL FLAME ICON: UNFILLED BASE SILHOUETTE (Reference Image)*/}
              {/* Sourced from attar-logo-icon.png (Left & right are transparent)*/}
              {/* Silver-gray frosted base waiting to be filled with essence    */}
              {/* ------------------------------------------------------------ */}
              <div className="absolute inset-0 pointer-events-none select-none">
                <img
                  src="/images/attar-logo-icon.png"
                  alt="Attar Flame Icon Base"
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'grayscale(100%) brightness(0.85) contrast(1.1) opacity(0.35)',
                  }}
                />
              </div>

              {/* ------------------------------------------------------------ */}
              {/* CENTRAL FLAME ICON: LIQUID GOLD FILL LAYER (Fills 0% -> 100%) */}
              {/* Purely isolated to the icon using vertical inset clip-path   */}
              {/* Exactly implements the bottom-to-top fill from reference img */}
              {/* ------------------------------------------------------------ */}
              <div
                className="absolute inset-0 pointer-events-none select-none overflow-hidden"
                style={{
                  clipPath: `inset(${Math.max(0, 100 - progress)}% 0 0 0)`,
                  willChange: 'clip-path',
                }}
              >
                <img
                  src="/images/attar-logo-icon.png"
                  alt="Attar Flame Icon Filled"
                  className="w-full h-full object-contain drop-shadow-[0_0_24px_rgba(245,180,24,0.75)]"
                />

                {/* Subtle Moving Gold Shimmer across the filled portion of the icon */}
                {!prefersReducedMotion && progress > 5 && progress < 100 && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFBE8]/45 to-transparent pointer-events-none"
                    style={{
                      animation: 'goldShimmer 2.2s ease-in-out infinite',
                      willChange: 'transform, opacity',
                    }}
                  />
                )}
              </div>

              {/* ------------------------------------------------------------ */}
              {/* GLOWING LIQUID MENISCUS / WAVE LINE (CENTRAL FLAME ONLY)      */}
              {/* Rides the liquid fill surface horizontally across the flame   */}
              {/* ------------------------------------------------------------ */}
              {progress > 1 && progress < 99 && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: '36%',
                    width: '28%',
                    top: `${100 - progress}%`,
                    height: '4px',
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Glowing surface beam */}
                    <div
                      className="w-full h-[2.5px] bg-gradient-to-r from-transparent via-[#FFF9D6] via-[#F5B418] to-transparent rounded-full shadow-[0_0_12px_#FFF3A8,0_0_24px_rgba(245,180,24,0.9)]"
                      style={{
                        animation: prefersReducedMotion ? 'none' : 'meniscusPulse 1.2s ease-in-out infinite',
                      }}
                    />
                    {/* Soft luminous liquid droplet light at the center */}
                    <div className="absolute w-6 h-[4px] bg-white/90 rounded-full blur-[1px]" />
                    <div className="absolute w-12 h-3 bg-[#F5B418] rounded-full blur-[4px] opacity-75" />
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* 3. LUXURY "LOADING..." & PROGRESS BAR UX (MATCHING REF IMAGE)  */}
            {/* ============================================================== */}
            <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center space-y-3">
              {/* Elegant Serif "Loading..." with Smooth Staggered Trailing Dots */}
              <div className="flex items-baseline space-x-1 font-serif text-base sm:text-lg tracking-[0.25em] text-[#FAF8F2]">
                <span className="font-semibold tracking-[0.22em] uppercase bg-gradient-to-r from-[#FFF8D1] via-[#F5B418] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,180,24,0.3)]">
                  Loading
                </span>
                <span className="inline-flex tracking-[0.1em] text-[#F5B418] font-bold text-lg select-none">
                  <span className="animate-dot-1">.</span>
                  <span className="animate-dot-2">.</span>
                  <span className="animate-dot-3">.</span>
                </span>
              </div>





            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

