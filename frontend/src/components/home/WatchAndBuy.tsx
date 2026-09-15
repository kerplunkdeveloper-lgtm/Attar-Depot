'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Play,
  Volume2,
  VolumeX,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Star,
} from 'lucide-react';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toast } from '@/lib/toast';

export interface WatchAndBuyItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  slug: string;
  thumbnail: string;
  videoUrl: string;
  fallbackVideoUrl?: string;
  posterUrl: string;
  reviewerName: string;
  reviewerHandle: string;
  reviewText: string;
  rating: number;
  size: string;
  badge?: string;
}

const REEL_ITEMS: WatchAndBuyItem[] = [
  {
    id: 'reel-1',
    title: 'Artiscents Atomizer',
    price: 799,
    originalPrice: 1299,
    discountPercent: 38,
    slug: 'artiscents-atomizer',
    thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=300',
    posterUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    reviewerName: 'Aaliyah M.',
    reviewerHandle: '@aaliyah_scents',
    reviewText: 'The sleek gold packaging is stunning! The ultra-fine mist atomizer distributes pure attar oil effortlessly without sticking.',
    rating: 5,
    size: '10ml Flacon',
    badge: 'Trending',
  },
  {
    id: 'reel-2',
    title: 'Eternal Grace',
    price: 999,
    originalPrice: 1799,
    discountPercent: 44,
    slug: 'eternal-grace',
    thumbnail: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=300',
    posterUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    reviewerName: 'Priya Sharma',
    reviewerHandle: '@priya_luxury',
    reviewText: 'Crisp green pear with royal Kannauj Damask rose. Sweet, refreshing, and 100% alcohol-free. Lasts all day on my skin!',
    rating: 5,
    size: '12ml Flacon',
    badge: 'Bestseller',
  },
  {
    id: 'reel-3',
    title: 'Black Tie',
    price: 999,
    originalPrice: 1799,
    discountPercent: 44,
    slug: 'black-tie',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    reviewerName: 'Kabir Roy',
    reviewerHandle: '@kabir_lifestyle',
    reviewText: 'Dark Cambodian agarwood blended with smoky Tuscan leather. Wore this to an evening gala and got asked about it 5 times.',
    rating: 5,
    size: '12ml Flacon',
    badge: 'Must Have',
  },
  {
    id: 'reel-4',
    title: 'Ocean Bound',
    price: 999,
    originalPrice: 1799,
    discountPercent: 44,
    slug: 'ocean-bound',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    posterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    reviewerName: 'Zoya Khan',
    reviewerHandle: '@zoyakhan_beauty',
    reviewText: 'Unboxing the bespoke silk packaging felt like opening a royal heirloom. The ambergris and sea breeze notes are so calming.',
    rating: 5,
    size: '12ml Flacon',
    badge: 'Unboxing',
  },
  {
    id: 'reel-5',
    title: 'Modern Royalty',
    price: 999,
    originalPrice: 1899,
    discountPercent: 47,
    slug: 'modern-royalty',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    posterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    reviewerName: 'Rohan Verma',
    reviewerHandle: '@rohan_perfumes',
    reviewText: 'Assamese vintage dehn al oudh with saffron and amber. Just two dabs with the glass rod and the scent trail lasts for 48 hours!',
    rating: 5,
    size: '6ml Pure Oil',
    badge: 'Royal Oudh',
  },
];

export default function WatchAndBuy() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedReel, setSelectedReel] = useState<WatchAndBuyItem | null>(null);

  // Global touch/click/scroll listener to kickstart all muted videos on mobile & desktop
  useEffect(() => {
    const playAllVideos = () => {
      document.querySelectorAll<HTMLVideoElement>('section[data-watch-and-buy] video').forEach((vid) => {
        vid.defaultMuted = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.play().catch(() => {});
      });
    };

    window.addEventListener('touchstart', playAllVideos, { once: true, passive: true });
    window.addEventListener('click', playAllVideos, { once: true, passive: true });
    window.addEventListener('scroll', playAllVideos, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', playAllVideos);
      window.removeEventListener('click', playAllVideos);
      window.removeEventListener('scroll', playAllVideos);
    };
  }, []);

  return (
    <section data-watch-and-buy className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Clean Centered Header matching screenshot */}
      <div className="text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
          Watch and Buy
        </h2>
      </div>

      {/* Horizontal Carousel Track with Video Reels */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory scrollbar-none overscroll-contain"
      >
        {REEL_ITEMS.map((item) => (
          <VideoReelCard
            key={item.id}
            item={item}
            onOpenModal={() => setSelectedReel(item)}
          />
        ))}
      </div>

      {/* Full-Screen Interactive Shoppable Reel Modal */}
      {selectedReel && (
        <ReelModal
          item={selectedReel}
          onClose={() => setSelectedReel(null)}
          onNext={() => {
            const currIdx = REEL_ITEMS.findIndex((r) => r.id === selectedReel.id);
            const nextIdx = (currIdx + 1) % REEL_ITEMS.length;
            setSelectedReel(REEL_ITEMS[nextIdx]);
          }}
          onPrev={() => {
            const currIdx = REEL_ITEMS.findIndex((r) => r.id === selectedReel.id);
            const prevIdx = (currIdx - 1 + REEL_ITEMS.length) % REEL_ITEMS.length;
            setSelectedReel(REEL_ITEMS[prevIdx]);
          }}
        />
      )}
    </section>
  );
}

/**
 * Autoplaying Video Reel Card (Exact match to user screenshot with live video display)
 */
function VideoReelCard({
  item,
  onOpenModal,
}: {
  item: WatchAndBuyItem;
  onOpenModal: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Setup autoplay via IntersectionObserver and DOM properties
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    tryPlay();

    // Trigger play as soon as visible in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [item.videoUrl]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onOpenModal}
      className="group relative w-[220px] xs:w-[240px] sm:w-[260px] md:w-[280px] h-[390px] xs:h-[420px] sm:h-[460px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-neutral-200/80 hover:border-emerald-500/60 transition-all duration-300 snap-start shrink-0 cursor-pointer bg-neutral-900"
    >
      {/* Live Video Playing Continuously (No static poster hiding the video) */}
      <video
        ref={(el) => {
          videoRef.current = el;
          if (el) {
            el.defaultMuted = true;
            el.muted = true;
            el.playsInline = true;
          }
        }}
        src={item.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={(e) => {
          e.currentTarget.muted = true;
          e.currentTarget.play().catch(() => {});
          setIsPlaying(true);
        }}
        onLoadedData={(e) => {
          e.currentTarget.muted = true;
          e.currentTarget.play().catch(() => {});
          setIsPlaying(true);
        }}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Play Icon indicator when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center border border-white/40 shadow-lg">
            <Play className="w-6 h-6 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Subtle Video Progress Bar at the Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-emerald-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom Gradient Overlay with Product Info (Exact UI Match to Screenshot) */}
      <div className="absolute inset-x-0 bottom-0 pt-16 pb-3.5 px-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between gap-2.5 z-10 pointer-events-none">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Square Product Thumbnail */}
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/95 border border-white/30 shrink-0 shadow-xs">
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          {/* Product Name & Pricing */}
          <div className="min-w-0 flex-1 text-left">
            <h4 className="font-sans text-xs sm:text-sm font-bold text-white truncate drop-shadow-md leading-tight">
              {item.title}
            </h4>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-sans text-xs sm:text-sm font-bold text-white drop-shadow-md">
                ₹ {item.price}
              </span>
              {item.originalPrice && (
                <span className="text-[10px] sm:text-[11px] text-white/70 line-through">
                  ₹ {item.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-Screen Shoppable Reel Modal (Instagram Reels / TikTok Luxury Style)
 */
function ReelModal({
  item,
  onClose,
  onNext,
  onPrev,
}: {
  item: WatchAndBuyItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: item.id,
        name: item.title,
        slug: item.slug,
        image: item.thumbnail,
        size: item.size,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: 1,
        stock: 10,
      })
    );

    setIsAdded(true);
    toast.success(`${item.title} added to your fragrance cart!`, {
      title: 'Added to Cart',
    });
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop Click Dismiss */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Desktop Prev Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-neutral-900 backdrop-blur-md border border-white/20 items-center justify-center transition-all shadow-lg active:scale-95"
        aria-label="Previous video"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Desktop Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-neutral-900 backdrop-blur-md border border-white/20 items-center justify-center transition-all shadow-lg active:scale-95"
        aria-label="Next video"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Video Reel Container */}
      <div
        className="relative z-10 w-full h-[100dvh] sm:h-[88vh] sm:max-h-[820px] sm:w-[410px] bg-black sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-0 sm:border sm:border-white/20"
        onClick={togglePlay}
      >
        {/* Full Vertical Video Player */}
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.posterUrl}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Controls Overlay */}
        <div className="relative z-20 p-4 sm:p-5 pt-[max(1rem,env(safe-area-inset-top))] flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
          {/* Reviewer Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {item.reviewerName.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {item.reviewerName}
              </p>
              <p className="text-[10px] text-white/70 font-medium">
                {item.reviewerHandle}
              </p>
            </div>
          </div>

          {/* Action Buttons: Sound & Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Pause Indicator when clicked */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/30 animate-in zoom-in-75">
              <Play className="w-7 h-7 fill-white translate-x-1" />
            </div>
          </div>
        )}

        {/* Bottom Shoppable Card Overlay */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-20 p-4 sm:p-5 pb-[max(1.2rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-3"
        >
          {/* Customer Quote */}
          <div className="text-left">
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
              <span className="text-[10px] text-white/80 font-bold ml-1">5.0 Verified Scent</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-normal line-clamp-2">
              &quot;{item.reviewText}&quot;
            </p>
          </div>

          {/* Shoppable Product Card inside Reel */}
          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-lg flex items-center justify-between gap-3">
            {/* Product Image & Info */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 shadow-2xs">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 text-left">
                <Link
                  href={`/product/${item.slug}`}
                  onClick={onClose}
                  className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-emerald-800 transition-colors truncate block"
                >
                  {item.title}
                </Link>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-bold text-neutral-950">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full ml-auto">
                    Save {item.discountPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all shrink-0 active:scale-95 shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
