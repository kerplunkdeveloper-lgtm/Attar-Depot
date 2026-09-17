'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
} from 'lucide-react';

export interface WatchAndBuyItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  slug: string;
  videoUrl: string;
  reviewerName: string;
  reviewerHandle: string;
  reviewText: string;
  rating: number;
  size: string;
  badge?: string;
}

// Perfume vertical videos from Pexels (portrait 9:16)
const REEL_ITEMS: WatchAndBuyItem[] = [
  {
    id: 'reel-1',
    title: 'Artiscents Atomizer',
    price: 799,
    originalPrice: 1299,
    discountPercent: 38,
    slug: 'artiscents-atomizer',
    // Perfume bottle spray — Pexels #6585753
    videoUrl: 'https://videos.pexels.com/video-files/6585753/6585753-hd_1080_1920_30fps.mp4',
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
    // Luxury perfume close-up — Pexels #7641847
    videoUrl: 'https://videos.pexels.com/video-files/7641847/7641847-hd_1080_1920_25fps.mp4',
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
    // Dark oud fragrance — Pexels #5940838
    videoUrl: 'https://videos.pexels.com/video-files/5940838/5940838-hd_1080_1920_25fps.mp4',
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
    // Fragrance unboxing — Pexels #7641848
    videoUrl: 'https://videos.pexels.com/video-files/7641848/7641848-hd_1080_1920_25fps.mp4',
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
    // Royal oudh — Pexels #6585754
    videoUrl: 'https://videos.pexels.com/video-files/6585754/6585754-hd_1080_1920_30fps.mp4',
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
      className="group relative w-[185px] sm:w-[210px] md:w-[225px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/10 hover:border-emerald-400/60 transition-all duration-300 snap-start shrink-0 cursor-pointer bg-neutral-900"
      style={{ aspectRatio: '9/16' }}
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

      {/* Badge top-left */}
      {item.badge && (
        <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-[10px] font-bold text-white tracking-wide">
          {item.badge}
        </div>
      )}

      {/* Bottom Title + reviewer name overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pt-10 pb-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
        <p className="text-[11px] font-bold text-white leading-tight truncate drop-shadow">{item.title}</p>
        <p className="text-[10px] text-white/60 mt-0.5 truncate">{item.reviewerHandle}</p>
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

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

        </div>
      </div>
    </div>
  );
}
