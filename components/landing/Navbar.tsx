'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-[#fef9f3]/95 backdrop-blur-md border-[#dbc1b3]/50 shadow-sm'
          : 'bg-[#fef9f3]/80 backdrop-blur-md border-[#dbc1b3]/30'
      }`}
    >
      <div className="max-w-[1280px] mx-auto h-[72px] flex justify-between items-center px-4 md:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#E8843A] text-[24px]">pets</span>
          <span className="text-[24px] font-bold text-[#1c2329] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            furlo
          </span>
        </Link>

        {/* Links & CTA */}
        <div className="flex items-center gap-8">
          <a
            href="#features"
            className="hidden md:block text-[14px] font-medium text-[#554338] hover:text-[#E8843A] transition-colors"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Find Your Pack
          </a>
          <Link
            href="/join?mode=signin"
            className="bg-[#E8843A] text-white px-6 py-2 rounded-full text-[14px] font-medium hover:scale-105 transition-all active:scale-95 hover:shadow-lg hover:shadow-[#E8843A]/30"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Join the Pack
          </Link>
        </div>
      </div>
    </nav>
  )
}
