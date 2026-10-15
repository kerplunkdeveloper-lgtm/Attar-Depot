'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function AosLenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis with ultra-smooth 60/120fps physics
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.15,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    // Connect Lenis with AOS for seamless scroll-triggered animations
    const unbindScroll = lenis.on('scroll', () => {
      AOS.refresh();
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 2. Initialize AOS animations with optimized timings
    AOS.init({
      duration: 650,
      once: true,
      easing: 'ease-out-cubic',
      offset: 35,
      debounceDelay: 50,
      throttleDelay: 99,
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (typeof unbindScroll === 'function') unbindScroll();
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).lenis;
    };
  }, []);

  // On route change, smoothly reset scroll position and refresh animations
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
