'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ArrowRight,
} from 'lucide-react';
import { toast, ToastItem } from '@/lib/toast';

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(item.duration || 4000);

  useEffect(() => {
    if (!item.duration || item.duration <= 0) return;

    const interval = 20; // 20ms for buttery-smooth progress bar
    const totalDuration = item.duration;

    const timer = setInterval(() => {
      if (isPaused) {
        startTimeRef.current = Date.now();
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const currentRemaining = Math.max(0, remainingTimeRef.current - elapsed);
      const percent = (currentRemaining / totalDuration) * 100;
      setProgress(percent);

      if (currentRemaining <= 0) {
        clearInterval(timer);
        onDismiss();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [item.duration, isPaused, onDismiss]);

  const handleMouseEnter = () => {
    if (!isPaused) {
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    startTimeRef.current = Date.now();
    setIsPaused(false);
  };

  // Status configuration - Clean, modern, professional
  const getConfig = () => {
    switch (item.type) {
      case 'success':
        return {
          icon: <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />,
          iconBg: 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20',
          accentBar: 'bg-emerald-500',
          badgeText: 'Success',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-600 stroke-[2.2]" />,
          iconBg: 'bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20',
          accentBar: 'bg-rose-500',
          badgeText: 'Error',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 stroke-[2.2]" />,
          iconBg: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20',
          accentBar: 'bg-amber-500',
          badgeText: 'Warning',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4 h-4 text-sky-600 stroke-[2.2]" />,
          iconBg: 'bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20',
          accentBar: 'bg-sky-500',
          badgeText: 'Info',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full sm:w-[360px] bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.10)] border border-neutral-200/80 overflow-hidden pointer-events-auto transition-all duration-200 hover:shadow-[0_12px_36px_rgb(0,0,0,0.14)] hover:border-neutral-300 animate-in fade-in slide-in-from-top-3"
      role="status"
    >
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Status Icon Badge */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${config.iconBg}`}
        >
          {item.icon || config.icon}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 pt-0.5">
          {item.title ? (
            <>
              <h4 className="font-sans text-xs font-semibold text-neutral-900 tracking-tight leading-none mb-1">
                {item.title}
              </h4>
              <p className="font-sans text-xs text-neutral-600 leading-relaxed break-words">
                {item.message}
              </p>
            </>
          ) : (
            <p className="font-sans text-xs font-medium text-neutral-800 leading-relaxed break-words">
              {item.message}
            </p>
          )}

          {/* Optional Action Button */}
          {item.action && (
            <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  item.action?.onClick();
                  onDismiss();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-md transition-all duration-150 group/btn cursor-pointer"
              >
                <span>{item.action.label}</span>
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 -mr-1 -mt-0.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sleek Minimalist Countdown Progress Bar */}
      <div className="w-full bg-neutral-100 h-[2.5px] overflow-hidden">
        <div
          className={`h-full ${config.accentBar} transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });
    return () => unsubscribe();
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed top-4 right-3 sm:top-5 sm:right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-[calc(100vw-1.5rem)] sm:max-w-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastCard
          key={t.id}
          item={t}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ))}
    </div>,
    document.body
  );
}
