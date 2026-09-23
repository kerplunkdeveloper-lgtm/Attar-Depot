'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, MessageSquarePlus, Clock, Sparkles, X, ThumbsUp } from 'lucide-react';
import { Review } from '@/types';
import { useProductReviews, useAddReview } from '@/hooks/useReviews';
import { useAppSelector } from '@/store';
import { formatDate } from '@/lib/utils';

interface ReviewSectionProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ReviewSection({
  productId,
  averageRating,
  totalReviews,
}: ReviewSectionProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const addReviewMutation = useAddReview(productId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [longevityRating, setLongevityRating] = useState(5);
  const [projectionRating, setProjectionRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const displayRating = Number((averageRating || 5).toFixed(1));
  const reviewCount = reviews.length > 0 ? reviews.length : totalReviews;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setStatusMessage({ type: 'error', text: 'Please share your impressions of this fragrance.' });
      return;
    }

    try {
      await addReviewMutation.mutateAsync({
        rating,
        longevityRating,
        projectionRating,
        title: title.trim() || 'Exceptional Artisanal Attar',
        comment: comment.trim(),
      });

      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your olfactory testimonial has been submitted successfully.',
      });
      setTitle('');
      setComment('');
      setIsFormOpen(false);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit review. You may have already reviewed this item.',
      });
    }
  };

  return (
    <section id="reviews" className="space-y-6 sm:space-y-8 pt-6 sm:pt-10 border-t border-emerald-100/90 font-sans">
      {/* Header & Review CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 tracking-wider uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connoisseur Appraisals</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
            Testimonials & Olfactory Reviews
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Genuine experiences from collectors and perfume enthusiasts.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-emerald px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 self-start sm:self-auto shadow-emerald-sm text-white transition-transform active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Testimonial</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rating Scorecard Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-emerald-100 shadow-emerald-sm">
        {/* Overall Score */}
        <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-1 text-center sm:border-r border-emerald-100 pb-3 sm:pb-0 border-b sm:border-b-0">
          <div className="font-serif text-4xl sm:text-5xl font-black text-emerald-900">
            {displayRating}
          </div>
          <div>
            <div className="flex text-amber-400 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(displayRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-neutral-500 font-medium mt-1">
              Based on {reviewCount} verified {reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        {/* Longevity Stat */}
        <div className="flex items-center gap-3 px-2 sm:px-4 sm:border-r border-emerald-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900">Exceptional Longevity</p>
            <p className="text-[11px] text-neutral-500">96% report 16–24+ hours on fabrics and warm pulse points</p>
          </div>
        </div>

        {/* Authenticity Stat */}
        <div className="flex items-center gap-3 px-2 sm:px-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900">100% Collector Satisfaction</p>
            <p className="text-[11px] text-neutral-500">Handcrafted batch, authentic Assam & Kannauj lineage</p>
          </div>
        </div>
      </div>

      {/* Review Form Drawer / Panel */}
      {isFormOpen && (
        <div className="rounded-3xl glass-card p-5 sm:p-8 border border-emerald-200 bg-white shadow-emerald-sm animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-emerald-100">
            <div>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-emerald-950 uppercase">
                Submit Your Fragrance Appraisal
              </h4>
              <p className="text-[11px] text-neutral-500">Share your impressions of the opening notes, sillage, and longevity.</p>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close review form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs sm:text-sm text-neutral-700 max-w-md mx-auto">
                Please authenticate or sign in to verify your purchase and record your review in the archives.
              </p>
              <Link
                href="/login"
                className="inline-block btn-emerald px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              >
                Sign In to Review
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Overall Rating */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                    Overall Satisfaction
                  </label>
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 active:scale-95 transition-transform"
                        aria-label={`${star} Star`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-6 sm:h-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-emerald-800 ml-2">{rating} / 5</span>
                  </div>
                </div>

                {/* Longevity Rating */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                    Skin Longevity
                  </label>
                  <select
                    value={longevityRating}
                    onChange={(e) => setLongevityRating(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 20+ Hours (Epic)</option>
                    <option value={4}>⭐⭐⭐⭐ 14 – 18 Hours (Excellent)</option>
                    <option value={3}>⭐⭐⭐ 8 – 12 Hours (Moderate)</option>
                    <option value={2}>⭐⭐ 4 – 6 Hours (Subtle)</option>
                    <option value={1}>⭐ Under 4 Hours</option>
                  </select>
                </div>

                {/* Projection */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                    Sillage & Projection
                  </label>
                  <select
                    value={projectionRating}
                    onChange={(e) => setProjectionRating(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value={5}>Intoxicating & Royal (Strong)</option>
                    <option value={4}>Noticeable & Elegant (Moderate)</option>
                    <option value={3}>Intimate Skin Scent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Appraisal Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unrivaled depth and vintage agarwood purity"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Detailed Experience & Dry-Down Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the opening, heart accords, performance on apparel, and personal impressions..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 text-xs text-neutral-500 hover:text-neutral-800 font-medium rounded-xl hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addReviewMutation.isPending}
                  className="btn-emerald px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-emerald-sm disabled:opacity-50"
                >
                  {addReviewMutation.isPending ? 'Publishing...' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3.5 sm:space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            Gathering fragrance testimonials from the vault...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl glass-card p-8 sm:p-12 text-center space-y-3 bg-white border border-emerald-100 shadow-emerald-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <Sparkles className="w-6 h-6 opacity-80" />
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
              Be the First Connoisseur to Review
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              Share your impression of this exquisite flacon and assist fellow fragrance enthusiasts in discovering their signature scent.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-block btn-emerald px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white mt-2 shadow-emerald-sm"
            >
              Write First Review
            </button>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-2xl glass-card p-4 sm:p-6 border border-emerald-100 space-y-3 bg-white shadow-emerald-sm hover:border-emerald-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100/90 text-emerald-900 font-bold text-xs flex items-center justify-center border border-emerald-200 flex-shrink-0">
                    {rev.userName ? rev.userName[0].toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-neutral-900">
                      {rev.userName}
                    </h5>
                    {rev.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Fragrance Collector
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>
              </div>

              {rev.title && (
                <h6 className="font-serif text-sm sm:text-base font-bold text-emerald-950">
                  {rev.title}
                </h6>
              )}

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                {rev.comment}
              </p>

              <div className="flex flex-wrap gap-4 pt-3 border-t border-emerald-50 text-[11px] text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Longevity: <strong className="text-emerald-900 font-semibold">{rev.longevityRating || 5}/5</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Projection: <strong className="text-emerald-900 font-semibold">{rev.projectionRating || 5}/5</strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
