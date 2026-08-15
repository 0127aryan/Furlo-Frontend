'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const petAvatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDmIfmcSGJxc-swht8dA6RHXLLttshp2OIocWHm6lYers9cyOf6w7k2OEsumRqNBwqhj5Nk80dzbVjq8R3jA4-YmLwMGDa6XBRjoRw8MSDaJ7_TzR2CRMEEhrO902BOqG0QbeNqi5U_vh76KTiWWoB4GK3KytuOch1bu2GyysmZDHit4ueg_3NnMMNbn6qWWxqKKL0B67nDJQk8m73OyTXyMHcuoORr2fantty96h1gnjIw9eeiShlaMLhZh9tbEUr9UNdUwg0PTg0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA2nmIRPkVhcDZ_L5jy8IWMpfIORvuNmX2MOTJjP2RpxhHTeonZCYvQJrup645WJSEnga441eCob6SyE7cBnQY4MhyzJjSJYjqnpzNIeZ7cdJ4Y4i55loeQtcJxElAHQzD8lGVIZ1SWm43G4LjH-Ku2lYXEarDy0JM6TuNkUNqk2MxpBfPuRKh1-GbasGz-SB_m1qkq9Cs1-HHOUVkbXelPWC4Y9FDGltcryoMrkHG2z9fNE3xfT_NfhpyoDLAjux9fH4dCReQWU80',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Ei90uXTl3S-WZSkEqrH_sMBJVwAnAf0DVMAs9mhIkPZOC47djQ29AX3qM7RC05jESL0sxdood7uenO1ChUqv0WarmhObZeltbI_QEvJ9bP5VbxhcWSiIJbAvt-RJtyd4c7FO-wQxJLPB_KKuHgFM8s2SJu5En0njyUbc7ihNojO91q0hhVOXaI067UJpymeBB4UD1CWKRHgwdyaizC_uQ0yY6I5_mK3Q018SvMv5SqqOqULr6HBfk-G1GMwZOqFSsujgy76lrEQ',
]

const brunoPicture = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfp6g4-ctb9Q6gDDnbd9cb9H9B3iv6PGaKvTPjfJGBvZ2QPgxXqcBg-9WCwksHfBeJpAXXYBcZhbxBbTm9v73R4dckFtBiMuyZGDlBcEt1HrseWY7qBEVerjnvCOLUlJU3yEhA_V3RNg1DkDm-ec8NvtGpgQ0bjlIWqXaNPynory9GQm0PL9qgI_iOw9V0mfHd3YDoIv-aDfacTZP1k_4o4tJtNM6w50wMwMFkqom7vqxkRT_Digh97e5ZGCZ2CI8qalnLRghk3_Q'

export function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Floating animation via CSS class applied here
    const card = cardRef.current
    if (!card) return
  }, [])

  return (
    <header
      className="relative min-h-[calc(100vh-72px)] flex items-center py-16 px-4 md:px-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fef9f3 0%, #f8f1e8 100%)' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-[450px] h-[450px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8843A 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-[350px] h-[350px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2D4A3E 0%, transparent 70%)' }}
      />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-10">
        {/* Left Content */}
        <div className="hero-reveal">
          <div className="mb-5">
            <h1
              className="text-[52px] md:text-[72px] font-bold text-[#2D4A3E] leading-[0.93] mb-4 tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Where pets<br />belong.
            </h1>
            <div className="w-10 h-[3px] bg-[#E8843A] rounded-full" />
          </div>

          <p
            className="text-[18px] leading-relaxed text-[#554338] mb-8 md:mb-10 max-w-[420px]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            India&apos;s first social network built for your dog, your cat, and every tail in between.
          </p>

          <div className="flex flex-col gap-6 md:gap-5 items-start mt-4 md:mt-0">
            <Link
              href="/join?mode=signin"
              id="hero-cta"
              className="bg-[#E8843A] text-white px-8 py-3.5 rounded-full text-[18px] font-semibold transition-all hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-[#E8843A]/30"
              style={{ fontFamily: 'Outfit, sans-serif', animation: 'pulse-cta 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1)' }}
            >
              Join the Pack
            </Link>

            <div className="flex items-center gap-3">
              {/* Avatar group */}
              <div className="flex">
                {petAvatars.map((src, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#fef9f3] overflow-hidden bg-[#ece7e2]"
                    style={{ marginLeft: i === 0 ? 0 : '-12px', zIndex: petAvatars.length - i }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Pet avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div
                  className="w-10 h-10 rounded-full border-2 border-[#fef9f3] bg-[#2D4A3E] flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ marginLeft: '-12px' }}
                >
                  +
                </div>
              </div>
              <span
                className="text-[14px] font-medium text-[#554338]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                12,000+ pets already here
              </span>
            </div>
          </div>
        </div>

        {/* Right: Floating App Card */}
        <div className="relative flex justify-center items-center hero-reveal" style={{ transitionDelay: '200ms' }}>
          {/* Paw background watermark */}
          <span
            className="material-symbols-outlined absolute text-[#E8843A] pointer-events-none select-none"
            style={{ fontSize: '380px', opacity: 0.06, transform: 'translate(-25%, -25%)' }}
          >
            pets
          </span>

          {/* Shadow card (peeking) */}
          <div
            className="absolute w-[300px] h-[380px] rounded-[20px] border border-[#dbc1b3]/20"
            style={{ background: '#FFFBF7', transform: 'translate(32px, 32px)', opacity: 0.4, boxShadow: '0 2px 12px rgba(28,35,41,0.06)' }}
          />

          {/* Main floating card */}
          <div
            ref={cardRef}
            className="relative w-[300px] h-[380px] rounded-[20px] border border-[#dbc1b3]/20 p-4 flex flex-col overflow-hidden"
            style={{
              background: '#FFFBF7',
              boxShadow: '0 8px 40px rgba(28,35,41,0.10)',
              animation: 'float-card 5s ease-in-out infinite',
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#ece7e2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brunoPicture} alt="Bruno" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#1c2329] leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Bruno</span>
                  <span className="text-[12px] text-[#554338] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Golden Retriever · Bengaluru</span>
                </div>
              </div>
              <button className="bg-[#E8843A] text-white text-[12px] px-3 py-1 rounded-full font-medium">Follow</button>
            </div>

            {/* Card image */}
            <div className="w-full h-[180px] bg-[#EDE8E1] rounded-xl mb-3 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brunoPicture} alt="Bruno at Cubbon Park" className="w-full h-full object-cover opacity-80" />
              <span className="material-symbols-outlined absolute text-[60px] text-[#554338]/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">pets</span>
            </div>

            {/* Card text */}
            <p className="text-[13px] leading-relaxed text-[#1c2329] mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Sunday morning at Cubbon Park. Best zoomies ever. 🌿
            </p>

            {/* Card stats */}
            <div className="mt-auto flex gap-4 text-[12px] font-medium text-[#554338]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <span>🐾 124 Treats</span>
              <span>💬 18 Barks</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
