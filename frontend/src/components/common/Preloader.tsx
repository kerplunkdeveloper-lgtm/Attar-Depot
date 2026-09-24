'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extended time to appreciate the luxury preloader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#011a14] overflow-hidden"
        >
          {/* Background Ambient Glows & Gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#034436]/40 via-[#011a14]/90 to-[#000000] pointer-events-none" />
          
          {/* Decorative Arches & Lines (like the reference) */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            {/* Left Pillar Line */}
            <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A227] to-transparent" />
            {/* Right Pillar Line */}
            <div className="absolute right-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A227] to-transparent" />
            
            {/* Corner floral/ornament abstract glows */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#F5B418]/15 to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#F5B418]/15 to-transparent blur-3xl" />
          </div>

          {/* Central Pulsating Glow behind Logo */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#F5B418]/25 blur-[100px] rounded-full pointer-events-none" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center w-full max-w-lg px-6"
          >
            {/* Logo */}
            <div className="relative mb-16 group flex justify-center">
              <Image
                src="/images/logonew.png"
                alt="The Attar Depot"
                width={380}
                height={190}
                priority
                className="object-contain drop-shadow-[0_0_25px_rgba(245,180,24,0.6)] relative z-10"
              />
            </div>
            
            {/* Loading Bar Container matching reference */}
            <div className="relative w-[85%] md:w-full flex flex-col items-center">
              {/* Outer Golden Border with padding to create the shell effect */}
              <div className="w-full h-3.5 md:h-4 rounded-full overflow-hidden relative shadow-[0_0_20px_rgba(245,180,24,0.15)] border border-[#C9A227]/80 bg-black/50 backdrop-blur-sm p-[2px]">
                {/* Inner Animated progress bar */}
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#8A6A1C] via-[#F5B418] to-[#FFF1C5] rounded-full relative overflow-hidden shadow-[0_0_15px_#F5B418]"
                >
                  {/* Flaring light moving across the bar */}
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "300%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-30deg]" 
                  />
                </motion.div>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-6 text-[10px] md:text-[11px] tracking-[0.55em] font-light text-[#E5C773] uppercase drop-shadow-md ml-2"
              >
                Loading...
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
