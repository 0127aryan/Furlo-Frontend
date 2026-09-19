'use client'

import Link from 'next/link'

export function CTASection() {
  return (
    <section className="slanted-cta-edge w-full bg-[#011E14] text-white pt-24 pb-20 lg:pt-32 lg:pb-28 relative overflow-hidden -mt-8 flex flex-col items-center justify-center text-center">
      {/* Ambient Floating Light-Toned Paw Layer for Dark Emerald CTA (4 Paws) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] select-none text-[#FAF7F2]">
        <svg
          className="ambient-paw-dark-1 absolute top-12 left-10 w-36 h-36"
          fill="currentColor"
          viewBox="0 0 48 48"
        >
          <path d="M24 20C19.5817 20 16 23.5817 16 28C16 33.5 20.5 39 24 41C27.5 39 32 33.5 32 28C32 23.5817 28.4183 20 24 20Z" />
          <ellipse cx="14" cy="17" rx="4" ry="5.5" />
          <ellipse cx="20.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="27.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="34" cy="17" rx="4" ry="5.5" />
        </svg>
        <svg
          className="ambient-paw-dark-2 absolute bottom-10 right-16 w-44 h-44"
          fill="currentColor"
          viewBox="0 0 48 48"
        >
          <path d="M24 20C19.5817 20 16 23.5817 16 28C16 33.5 20.5 39 24 41C27.5 39 32 33.5 32 28C32 23.5817 28.4183 20 24 20Z" />
          <ellipse cx="14" cy="17" rx="4" ry="5.5" />
          <ellipse cx="20.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="27.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="34" cy="17" rx="4" ry="5.5" />
        </svg>
        <svg
          className="ambient-paw-dark-3 absolute top-16 right-1/4 w-32 h-32"
          fill="currentColor"
          viewBox="0 0 48 48"
        >
          <path d="M24 20C19.5817 20 16 23.5817 16 28C16 33.5 20.5 39 24 41C27.5 39 32 33.5 32 28C32 23.5817 28.4183 20 24 20Z" />
          <ellipse cx="14" cy="17" rx="4" ry="5.5" />
          <ellipse cx="20.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="27.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="34" cy="17" rx="4" ry="5.5" />
        </svg>
        <svg
          className="ambient-paw-dark-4 absolute bottom-12 left-1/3 w-30 h-30"
          fill="currentColor"
          viewBox="0 0 48 48"
        >
          <path d="M24 20C19.5817 20 16 23.5817 16 28C16 33.5 20.5 39 24 41C27 39 32 33.5 32 28C32 23.5817 28.4183 20 24 20Z" />
          <ellipse cx="14" cy="17" rx="4" ry="5.5" />
          <ellipse cx="20.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="27.5" cy="11.5" rx="3.8" ry="5.2" />
          <ellipse cx="34" cy="17" rx="4" ry="5.5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 lg:px-8 flex flex-col items-center justify-center text-center">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight text-center scroll-reveal"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          A home your pet actually deserves.
        </h2>
        <p
          className="mt-4 text-base lg:text-lg text-[#c9ead9]/80 max-w-xl mx-auto leading-relaxed text-center scroll-reveal"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Join thousands of loving pet parents cultivating healthy, joyful, and connected companion lives across India.
        </p>

        {/* Translucent Border Stat Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-center scroll-reveal">
          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/15">
            <span>🐾</span>
            <span>100+ Pets</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/15">
            <span>📍</span>
            <span>Pan-India</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/15">
            <span>🐕</span>
            <span>3 Breed Communities</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-10 flex items-center justify-center text-center scroll-reveal">
          <Link
            href="/join"
            className="btn-press inline-flex items-center justify-center gap-2.5 bg-[#E8843A] hover:bg-[#d9752c] text-white text-sm font-bold rounded-full px-9 py-4 shadow-md transition-all"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <span>Join the Pack</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
