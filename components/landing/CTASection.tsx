'use client'

import Link from 'next/link'

const stats = [
  { value: '12,000+', label: 'Pets' },
  { value: '8', label: 'Cities' },
  { value: '3', label: 'Breed Communities' },
]

export function CTASection() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: '#2D4A3E' }}
    >
      {/* Dot pattern decoration */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Ambient glows */}
      <div
        className="absolute top-[-60px] right-[10%] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8843A 0%, transparent 70%)' }}
      />

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 text-center relative z-10">
        <h2
          className="text-[36px] md:text-[52px] font-bold text-white mb-8 leading-tight"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          A home your pet <br />actually deserves.
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="px-6 py-2.5 rounded-full border border-white/20 text-white text-[14px] font-medium"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {value} {label}
            </div>
          ))}
        </div>

        <Link
          href="/join?mode=signin"
          id="cta-join-pack"
          className="inline-block bg-[#E8843A] text-white px-10 py-4 rounded-full text-[20px] font-semibold transition-all hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-[#E8843A]/40"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Join the Pack
        </Link>
      </div>
    </section>
  )
}
