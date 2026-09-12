import React from 'react';
import { Sparkles, Heart, Anchor } from 'lucide-react';
import { FragranceNotes } from '@/types';

interface FragrancePyramidProps {
  notes?: FragranceNotes;
}

export default function FragrancePyramid({ notes }: FragrancePyramidProps) {
  if (!notes) return null;

  const topNotes = notes.topNotes || [];
  const heartNotes = notes.heartNotes || [];
  const baseNotes = notes.baseNotes || [];

  return (
    <div className="rounded-3xl glass-card p-6 sm:p-8 border border-rose-100 space-y-6 bg-white shadow-rose-sm">
      <div className="text-center space-y-1.5">
        <h3 className="font-poppins text-lg sm:text-xl font-bold tracking-wider text-rose-gradient uppercase">
          Olfactory Pyramid & Harmonious Accords
        </h3>
        <p className="text-xs text-neutral-500 max-w-lg mx-auto">
          Crafted through successive botanical hydro-distillations to evolve dynamically on warm skin.
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        {/* Top Notes */}
        <div className="relative p-5 rounded-2xl bg-[#F4FAF6] border border-emerald-100/70">
          <div className="flex items-center gap-2 mb-2.5 text-rose-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 font-poppins">
              Top Notes (First 30 Minutes)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topNotes.length > 0 ? (
              topNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-white text-neutral-800 border border-rose-200/80 font-medium shadow-2xs"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400">Sparkling citrus, dewy florals & spices</span>
            )}
          </div>
        </div>

        {/* Heart / Middle Notes */}
        <div className="relative p-5 rounded-2xl bg-[#FFF0F4] border border-rose-200/60">
          <div className="flex items-center gap-2 mb-2.5 text-rose-600">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-poppins">
              Heart / Middle Notes (2 - 6 Hours)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {heartNotes.length > 0 ? (
              heartNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-white text-neutral-800 border border-rose-200/80 font-medium shadow-2xs"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400">Aged woods, Damask rose & balsamic nectar</span>
            )}
          </div>
        </div>

        {/* Base Notes */}
        <div className="relative p-5 rounded-2xl bg-[#FFE6EC] border border-rose-200">
          <div className="flex items-center gap-2 mb-2.5 text-rose-700">
            <Anchor className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900 font-poppins">
              Base Notes (8 - 24+ Hours Deep Dry-Down)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {baseNotes.length > 0 ? (
              baseNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-white text-neutral-900 border border-rose-300 font-semibold shadow-2xs"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400">Ancient agarwood, Kashmiri musk & golden amber</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
