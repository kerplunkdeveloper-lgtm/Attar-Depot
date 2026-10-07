'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const pathname = usePathname();
  // Never show preloader on admin login, admin dashboard, or any admin routes
  const isAdminRoute = Boolean(
    pathname?.startsWith('/admin') ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'))
  );

  const [isLoading, setIsLoading] = useState(() => !isAdminRoute);
  const [progress, setProgress] = useState(() => (isAdminRoute ? 100 : 0));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If on an admin route, immediately dismiss preloader and cancel any pending animations
  useEffect(() => {
    if (isAdminRoute) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      setIsLoading(false);
      setProgress(100);
    }
  }, [isAdminRoute]);

  // Check user preference for reduced motion
  useEffect(() => {
    if (isAdminRoute) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [isAdminRoute]);

  // Preload logo assets & royal background immediately into browser memory for zero-lag instant rendering
  useEffect(() => {
    if (isAdminRoute) return;
    const textImg = new window.Image();
    textImg.src = '/images/attar-logo-text.png';
    const iconImg = new window.Image();
    iconImg.src = '/images/attar-logo-icon.png';
    const bgImg = new window.Image();
    bgImg.src = '/images/preloader-bg.jpg';
  }, [isAdminRoute]);

  // Safe skip handler
  const handleSkip = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    setProgress(100);
    setIsLoading(false);
  };

  // Organic physics-based liquid fill loading curve (0% -> 100%) applied specifically to the logo icon
  useEffect(() => {
    if (isAdminRoute) return;
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
        exitTimerRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 320);
      }
    };

    rafRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [prefersReducedMotion, isAdminRoute]);

  // Safety fallback timeout to guarantee dismissal under any network or backgrounding state
  useEffect(() => {
    if (isAdminRoute) return;
    safetyTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [isAdminRoute]);

  // Keyboard shortcut (Escape) to skip preloader instantly
  useEffect(() => {
    if (isAdminRoute) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminRoute]);

  // Dynamic meniscus wave geometry conforming organically to the flame silhouette
  const meniscusWidthPercent =
    progress < 25
      ? 10 + (progress / 25) * 14 // 10% -> 24%
      : progress < 65
      ? 24 + ((progress - 25) / 40) * 4 // 24% -> 28%
      : progress < 85
      ? 28 - ((progress - 65) / 20) * 14 // 28% -> 14%
      : Math.max(3, 14 - ((progress - 85) / 10) * 11); // 14% -> 3% (tapers to apex point)

  const meniscusLeftPercent = 50 - meniscusWidthPercent / 2;

  // Gracefully dissolve the meniscus beam as it reaches the apex so no horizontal line or box lid appears at the end
  const meniscusOpacity =
    progress >= 96
      ? 0
      : progress > 88
      ? Math.max(0, (96 - progress) / 8)
      : progress < 6
      ? progress / 6
      : 1;

  if (isAdminRoute) {
    return null;
  }

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
          {/* 1. LUXURY ROYAL PERFUMERY BACKGROUND (REFERENCE SCENE)         */}
          {/* ============================================================== */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* High-Resolution Royal Palace Perfumery Background */}
            <img
              src="/images/preloader-bg.jpg"
              alt=""
              className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08]"
            />

            {/* Subtle Royal Vignette & Central Alcove Shading for Contrast */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 48%, rgba(1, 26, 19, 0.40) 0%, rgba(0, 15, 11, 0.60) 60%, rgba(0, 8, 6, 0.85) 100%)',
              }}
            />
          </div>

          {/* Central Backlight Golden Corona behind the Logo */}
          <div
            className="absolute top-[48%] left-1/2 w-[300px] h-[260px] sm:w-[420px] sm:h-[320px] md:w-[500px] md:h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,180,24,0.22)_0%,rgba(4,106,90,0.12)_50%,transparent_72%)] blur-3xl pointer-events-none"
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
              {/* CENTRAL FLAME ICON: UNFILLED BASE SILHOUETTE                  */}
              {/* Sourced from attar-logo-icon.png (Left & right are transparent)*/}
              {/* Silver-gray frosted base waiting to be filled with essence    */}
              {/* ------------------------------------------------------------ */}
              <div 
                className="absolute inset-0 pointer-events-none select-none transition-opacity duration-300"
                style={{ opacity: progress >= 100 ? 0 : 1 }}
              >
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
              {/* Zero box boundaries: No overflow-hidden, no rectangular divs */}
              {/* ------------------------------------------------------------ */}
              <div
                className="absolute inset-0 pointer-events-none select-none"
                style={{
                  clipPath:
                    progress >= 99.5
                      ? 'none'
                      : `inset(${Math.max(0, 100 - progress)}% 0 0 0)`,
                  willChange: progress < 100 ? 'clip-path' : 'auto',
                }}
              >
                <img
                  src="/images/attar-logo-icon.png"
                  alt="Attar Flame Icon Filled"
                  className="w-full h-full object-contain drop-shadow-[0_0_18px_rgba(245,180,24,0.65)]"
                />
              </div>

              {/* ------------------------------------------------------------ */}
              {/* GLOWING LIQUID MENISCUS / WAVE LINE (CENTRAL FLAME ONLY)      */}
              {/* Organically tapers and dissolves as it reaches the apex       */}
              {/* ------------------------------------------------------------ */}
              {progress > 1 && progress < 96 && meniscusOpacity > 0 && (
                <div
                  className="absolute pointer-events-none z-20 transition-opacity duration-150"
                  style={{
                    left: `${meniscusLeftPercent}%`,
                    width: `${meniscusWidthPercent}%`,
                    top: `${100 - progress}%`,
                    height: '3px',
                    opacity: meniscusOpacity,
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Glowing surface beam */}
                    <div
                      className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFF9D6] via-[#F5B418] to-transparent rounded-full shadow-[0_0_10px_#FFF3A8,0_0_20px_rgba(245,180,24,0.85)]"
                      style={{
                        animation: prefersReducedMotion ? 'none' : 'meniscusPulse 1.2s ease-in-out infinite',
                      }}
                    />
                    {/* Soft luminous liquid droplet light at the center */}
                    <div className="absolute w-4 h-[3px] bg-white/90 rounded-full blur-[1px]" />
                    <div className="absolute w-8 h-2.5 bg-[#F5B418] rounded-full blur-[3px] opacity-75" />
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

