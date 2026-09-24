'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
      // If another event handler prevented default, don't show loading
      if (e.defaultPrevented) return;

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
          // Fallback to clear loading state in case navigation is aborted or gets stuck
          const fallback = setTimeout(() => {
            setLoading(false);
            setProgress(0);
          }, 8000);

          // We don't want to clear timeouts here in the click handler itself,
          // because if we do, it clears immediately. Wait, the previous code returned a cleanup 
          // function inside the click handler, which was wrong because addEventListener 
          // doesn't use the return value.
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
