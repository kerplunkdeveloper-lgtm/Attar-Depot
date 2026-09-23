import React from 'react';
import { Sparkles, Heart, Anchor, Droplets } from 'lucide-react';
import { FragranceNotes } from '@/types';

interface FragrancePyramidProps {
  notes?: FragranceNotes;
}

export default function FragrancePyramid({ notes }: FragrancePyramidProps) {
  if (!notes) return null;

  const topNotes = notes.topNotes || [];
  const heartNotes = notes.heartNotes || [];
  const baseNotes = notes.baseNotes || [];

  const hasAnyNotes = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;
  if (!hasAnyNotes) return null;

  return (
    <section className="rounded-3xl glass-card p-5 sm:p-8 lg:p-10 border border-emerald-100/90 bg-white/95 shadow-emerald-sm space-y-6 sm:space-y-8 font-sans">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
          <Droplets className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hydro-Distilled Evolution</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
          Olfactory Pyramid & Fragrance Accords
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Pure concentrated perfume oils evolve dynamically across three exquisite tiers as body temperature gently reveals each aromatic facet.
        </p>
      </div>

      {/* Pyramid Tiers */}
      <div className="space-y-3.5 sm:space-y-4 max-w-2xl mx-auto">
        {/* Tier 1: Top Notes */}
        <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-emerald-50/40 to-white border border-emerald-200/70 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider font-sans">
                Top Notes (Opening)
              </span>
            </div>
            <span className="inline-block text-[11px] font-medium text-emerald-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-100 self-start sm:self-auto">
              First 15 – 30 Minutes
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {topNotes.length > 0 ? (
              topNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white text-neutral-800 border border-emerald-200/80 font-medium shadow-2xs hover:border-emerald-400 transition-colors"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400 italic">Sparkling citrus, dewy petals & saffron accents</span>
            )}
          </div>
        </div>

        {/* Tier 2: Heart / Middle Notes */}
        <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/60 via-amber-50/30 to-white border border-amber-200/70 shadow-2xs hover:border-amber-300 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
            <div className="flex items-center gap-2 text-amber-900">
              <div className="w-6 h-6 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-800">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider font-sans">
                Heart / Middle Notes (Soul of Attar)
              </span>
            </div>
            <span className="inline-block text-[11px] font-medium text-amber-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-100 self-start sm:self-auto">
              2 – 6 Hours
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {heartNotes.length > 0 ? (
              heartNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white text-neutral-800 border border-amber-200/80 font-medium shadow-2xs hover:border-amber-400 transition-colors"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400 italic">Aged woods, Damask rose absolute & warm spices</span>
            )}
          </div>
        </div>

        {/* Tier 3: Base Notes */}
        <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/[0.04] via-emerald-900/[0.02] to-white border border-emerald-300/80 shadow-2xs hover:border-emerald-500 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
            <div className="flex items-center gap-2 text-emerald-900">
              <div className="w-6 h-6 rounded-lg bg-emerald-200/60 flex items-center justify-center text-emerald-900">
                <Anchor className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider font-sans">
                Base Notes (Deep Dry-Down)
              </span>
            </div>
            <span className="inline-block text-[11px] font-semibold text-emerald-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
              8 – 24+ Hours Longevity
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {baseNotes.length > 0 ? (
              baseNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white text-neutral-900 border border-emerald-300 font-semibold shadow-2xs hover:border-emerald-500 transition-colors"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400 italic">Wild Assam agarwood, ambergris & royal Kashmiri musk</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
