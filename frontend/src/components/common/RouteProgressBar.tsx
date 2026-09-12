'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, route navigation has completed
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Listen to clicks on internal Next.js links to show instant feedback
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      // If internal navigation link
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('/#') &&
        !target.getAttribute('target')
      ) {
        // Only trigger if destination is different from current URL
        const currentUrl = `${window.location.pathname}${window.location.search}`;
        if (href !== currentUrl) {
          setLoading(true);
          setProgress(25);

          const p1 = setTimeout(() => setProgress(65), 150);
          const p2 = setTimeout(() => setProgress(85), 350);

          return () => {
            clearTimeout(p1);
            clearTimeout(p2);
          };
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[120] h-[2.5px] bg-emerald-950/10 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#10B981] via-[#046A5A] to-[#D4AF37] shadow-[0_0_8px_rgba(4,106,90,0.6)] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
