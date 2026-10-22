'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const pathname = usePathname();
  const isAdminRoute = Boolean(pathname?.startsWith('/admin'));

  const [mounted, setMounted] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'text' | 'click'>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Position refs for 60fps lag-free RAF tracking
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    // If on admin routes (admin login, admin dashboard, etc.), completely disable custom cursor
    if (isAdminRoute) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    // Only enable custom cursor on devices with fine pointer (mouse/trackpad), NEVER on touchscreens
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsPointerFine(hasFinePointer);

    if (!hasFinePointer) return;

    // Optional: Hide default cursor on desktop body cleanly
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Instantly position the inner point for zero latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isText = Boolean(
        target.closest('input, textarea, [contenteditable="true"]') ||
        window.getComputedStyle(target).cursor === 'text'
      );

      const isClickable = Boolean(
        target.closest('a, button, [role="button"], [role="link"], input[type="submit"], input[type="button"], select, label, .cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      );

      if (isText) {
        setCursorState('text');
      } else if (isClickable) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseDown = () => setCursorState('click');
    const handleMouseUp = () => setCursorState('default');

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 60fps Smooth Spring-Lerp Animation for the outer luxury ring & ambient aura
    const render = () => {
      // Lerp smoothing: 0.18 gives a snappy yet buttery-fluid follower trail
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isAdminRoute]);

  if (!mounted || !isPointerFine || isAdminRoute) {
    return null;
  }

  // Dynamic styling based on interactive state
  const isHovered = cursorState === 'hover';
  const isClicked = cursorState === 'click';
  const isTextInput = cursorState === 'text';

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[999999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Ambient Royal Amber & Emerald Aura (Liquid Fragrance Droplet Glow) */}
      <div
        ref={auraRef}
        className={`absolute -top-10 -left-10 w-20 h-20 rounded-full blur-xl pointer-events-none transition-all duration-500 ease-out will-change-transform ${
          isHovered
            ? 'scale-150 bg-[#F5B418]/25'
            : isTextInput
            ? 'opacity-0'
            : 'scale-90 bg-[#F5B418]/12'
        }`}
      />

      {/* 2. Outer Smooth Luxury Follower Ring */}
      <div
        ref={ringRef}
        className={`absolute -top-5 -left-5 rounded-full pointer-events-none flex items-center justify-center transition-[width,height,background-color,border-color,box-shadow,transform] duration-300 ease-out will-change-transform ${
          isTextInput
            ? 'w-6 h-6 border border-emerald-400/40 bg-transparent opacity-40 scale-75'
            : isHovered
            ? 'w-14 h-14 -top-7 -left-7 border border-[#F5B418] bg-gradient-to-tr from-[#F5B418]/15 via-[#F5B418]/5 to-emerald-500/10 shadow-[0_0_20px_rgba(245,180,24,0.35)] backdrop-blur-[0.5px]'
            : isClicked
            ? 'w-8 h-8 -top-4 -left-4 border-2 border-[#FFDF78] bg-[#F5B418]/30 scale-90'
            : 'w-10 h-10 border border-[#F5B418]/65 bg-[#F5B418]/[0.03] shadow-[0_0_12px_rgba(245,180,24,0.18)]'
        }`}
      >
        {/* Subtle Ornamental Diamond accents when hovering clickable elements */}
        {isHovered && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] animate-ping opacity-75" />
        )}
      </div>

      {/* 3. Center Precision Gold Diamond / Pearl (Zero-Latency Core) */}
      <div
        ref={dotRef}
        className={`absolute -top-1.5 -left-1.5 rounded-full pointer-events-none transition-all duration-200 ease-out will-change-transform ${
          isTextInput
            ? 'w-1 h-3 -top-1.5 -left-0.5 rounded-sm bg-[#046A5A]'
            : isHovered
            ? 'w-2 h-2 -top-1 -left-1 bg-white ring-2 ring-[#F5B418] shadow-[0_0_10px_#F5B418]'
            : isClicked
            ? 'w-3 h-3 -top-1.5 -left-1.5 bg-[#FFDF78] shadow-[0_0_14px_#F5B418]'
            : 'w-2.5 h-2.5 bg-[#F5B418] shadow-[0_0_8px_rgba(245,180,24,0.8)] border border-[#012520]/60'
        }`}
      />
    </div>
  );
}
