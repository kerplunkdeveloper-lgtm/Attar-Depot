'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { toast, ToastItem } from '@/lib/toast';

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(item.duration || 4200);

  useEffect(() => {
    if (!item.duration || item.duration <= 0) return;

    const interval = 25; // 25ms tick for silky smooth progress bar
    const totalDuration = item.duration;

    const timer = setInterval(() => {
      if (isPaused) {
        startTimeRef.current = Date.now();
        return;
      }

      const elapsedSinceResume = Date.now() - startTimeRef.current;
      const currentRemaining = Math.max(0, remainingTimeRef.current - elapsedSinceResume);

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

  const getTypeStyles = () => {
    switch (item.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
          iconBg: 'bg-emerald-50 border border-emerald-200/80',
          titleColor: 'text-emerald-950',
          progressBar: 'bg-gradient-to-r from-emerald-400 via-emerald-600 to-[#046A5A]',
          border: 'border-emerald-200/90 shadow-emerald-500/10',
          defaultTitle: 'Sovereign Selection',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
          iconBg: 'bg-rose-50 border border-rose-200/80',
          titleColor: 'text-rose-950',
          progressBar: 'bg-gradient-to-r from-rose-400 via-rose-600 to-rose-700',
          border: 'border-rose-200/90 shadow-rose-500/10',
          defaultTitle: 'Notice',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
          iconBg: 'bg-amber-50 border border-amber-200/80',
          titleColor: 'text-amber-950',
          progressBar: 'bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600',
          border: 'border-amber-200/90 shadow-amber-500/10',
          defaultTitle: 'Attention',
        };
      case 'info':
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />,
          iconBg: 'bg-blue-50 border border-blue-200/80',
          titleColor: 'text-blue-950',
          progressBar: 'bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600',
          border: 'border-blue-200/90 shadow-blue-500/10',
          defaultTitle: 'House of Attar',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full sm:w-[380px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border ${styles.border} overflow-hidden pointer-events-auto transition-all duration-300 hover:shadow-emerald-md hover:scale-[1.01] animate-in fade-in slide-in-from-top-4 duration-250`}
      role="alert"
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon Badge */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${styles.iconBg}`}>
          {item.icon || styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h4 className={`font-serif text-sm font-bold tracking-wide ${styles.titleColor}`}>
            {item.title || styles.defaultTitle}
          </h4>
          <p className="font-sans text-xs text-neutral-600 mt-0.5 leading-relaxed break-words">
            {item.message}
          </p>

          {/* Action Button */}
          {item.action && (
            <button
              type="button"
              onClick={() => {
                item.action?.onClick();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/80 px-3 py-1 rounded-xl transition-all shadow-2xs group"
            >
              <span>{item.action.label}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toastify Animated Countdown Progress Bar */}
      <div className="w-full bg-neutral-100 h-[3px] overflow-hidden">
        <div
          className={`h-full ${styles.progressBar} transition-all ease-linear`}
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
      className="fixed top-4 right-3 sm:top-6 sm:right-6 z-[125] flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-1.5rem)] sm:max-w-none"
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
