import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#01140E] text-[#FAF8F2] flex flex-col items-center justify-center px-4 selection:bg-[#046A5A] selection:text-white">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="relative inline-block">
          <span className="text-7xl sm:text-8xl font-serif font-bold text-[#F5B418] drop-shadow-[0_2px_15px_rgba(245,180,24,0.4)]">
            404
          </span>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#F5B418] to-transparent mx-auto mt-2" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-wide text-neutral-100">
          Fragrance Not Found
        </h1>

        <p className="text-sm text-neutral-400 font-sans leading-relaxed">
          The artisanal creation or page you are seeking seems to have evaporated into the ether.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase bg-gradient-to-r from-[#046A5A] to-[#035346] text-white hover:from-[#05826f] hover:to-[#046A5A] transition-all shadow-[0_4px_20px_rgba(4,106,90,0.35)] hover:scale-[1.02]"
          >
            Return to Atelier
          </Link>
        </div>
      </div>
    </div>
  );
}
