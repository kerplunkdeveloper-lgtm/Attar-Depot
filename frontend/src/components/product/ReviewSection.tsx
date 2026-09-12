'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, MessageSquarePlus, Clock, Sparkles } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setStatusMessage({ type: 'error', text: 'Please write your thoughts on this fragrance.' });
      return;
    }

    try {
      await addReviewMutation.mutateAsync({
        rating,
        longevityRating,
        projectionRating,
        title: title.trim() || 'Remarkable Essence',
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
    <div className="space-y-8 pt-8 border-t border-rose-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-poppins text-2xl font-bold tracking-tight text-neutral-900 uppercase">
            Customer Testimonials & Olfactory Reviews
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Real evaluations from collectors and connoisseurs.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-rose px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start shadow-sm text-white"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Testimonial</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Review Form Drawer/Panel */}
      {isFormOpen && (
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-rose-200/80 animate-in fade-in duration-200 bg-white shadow-rose-sm">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-rose-100">
            <h4 className="font-poppins text-base font-bold text-rose-700 uppercase">
              Submit Your Fragrance Appraisal
            </h4>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-neutral-400 hover:text-neutral-700"
            >
              Cancel
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm text-neutral-700">
                Please authenticate or sign in to verify your purchase and leave a review.
              </p>
              <Link
                href="/login"
                className="inline-block btn-rose px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              >
                Sign In to Review
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Overall Rating */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-poppins">
                    Overall Satisfaction
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Longevity Rating */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-poppins">
                    Skin Longevity (Hours)
                  </label>
                  <select
                    value={longevityRating}
                    onChange={(e) => setLongevityRating(Number(e.target.value))}
                    className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-rose-400"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 20+ Hours (Epic)</option>
                    <option value={4}>⭐⭐⭐⭐ 14 - 18 Hours (Excellent)</option>
                    <option value={3}>⭐⭐⭐ 8 - 12 Hours (Moderate)</option>
                    <option value={2}>⭐⭐ 4 - 6 Hours (Subtle)</option>
                    <option value={1}>⭐ Under 4 Hours</option>
                  </select>
                </div>

                {/* Projection */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-poppins">
                    Sillage & Projection
                  </label>
                  <select
                    value={projectionRating}
                    onChange={(e) => setProjectionRating(Number(e.target.value))}
                    className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-rose-400"
                  >
                    <option value={5}>Enchanting & Monarchical (Heavy)</option>
                    <option value={4}>Seductive & Noticeable (Moderate)</option>
                    <option value={3}>Intimate Skin Scent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1 font-poppins">
                  Appraisal Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unrivaled depth and vintage agarwood purity"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1 font-poppins">
                  Detailed Experience & Dry-Down Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the opening, heart accords, performance on apparel, and personal impressions..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addReviewMutation.isPending}
                  className="btn-rose px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm"
                >
                  {addReviewMutation.isPending ? 'Publishing...' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-xs text-neutral-400 py-4">Gathering fragrance testimonials...</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl glass-card p-10 text-center space-y-3 bg-white border border-rose-100">
            <Sparkles className="w-8 h-8 text-rose-400 mx-auto opacity-70" />
            <h4 className="font-poppins text-lg font-bold text-neutral-800">
              Be the First to Review this Fragrance
            </h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Share your impression of this exquisite attar and help fellow fragrance connoisseurs select their signature scent.
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-2xl glass-card p-5 border border-rose-100 space-y-3 bg-white shadow-rose-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-poppins font-bold text-xs flex items-center justify-center border border-rose-200">
                    {rev.userName ? rev.userName[0].toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 font-poppins">
                      {rev.userName}
                    </h5>
                    {rev.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Verified Fragrance Collector
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 text-amber-400">
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
                <h6 className="font-poppins text-xs font-bold text-rose-800">
                  {rev.title}
                </h6>
              )}

              <p className="text-xs text-neutral-700 leading-relaxed">
                {rev.comment}
              </p>

              <div className="flex flex-wrap gap-4 pt-2.5 border-t border-rose-50 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  Longevity: <strong className="text-neutral-800">{rev.longevityRating || 5}/5</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Projection: <strong className="text-neutral-800">{rev.projectionRating || 5}/5</strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
