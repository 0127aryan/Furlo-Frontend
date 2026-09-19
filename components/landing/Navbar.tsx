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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE8E1] shadow-2xs'
          : 'bg-[#FAF7F2]/80 backdrop-blur-md border-b border-[#EDE8E1]/60'
      }`}
    >
      <div className="h-20 max-w-[1240px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#E8843A] flex items-center justify-center text-white shadow-2xs">
            <span
              className="material-symbols-outlined text-white text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pets
            </span>
          </div>
          <span
            className="text-[24px] font-bold text-[#163328] tracking-tight lowercase"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            furlo
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/feed"
            className="text-xs font-semibold text-[#727974] hover:text-[#163328] transition-colors duration-150"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            The Yard
          </Link>
          <Link
            href="/qa"
            className="text-xs font-semibold text-[#727974] hover:text-[#163328] transition-colors duration-150"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            QA Hub
          </Link>
          <Link
            href="/packs"
            className="text-xs font-semibold text-[#727974] hover:text-[#163328] transition-colors duration-150"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Packs
          </Link>
          <Link
            href="/feed"
            className="text-xs font-semibold text-[#727974] hover:text-[#163328] transition-colors duration-150"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            My Paw Print
          </Link>
        </nav>

        {/* Nav Actions */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/join?mode=signin"
            className="hidden sm:inline-block text-xs font-semibold text-[#727974] hover:text-[#163328] transition-colors duration-150 px-3 py-2"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Sign In
          </Link>
          <Link
            href="/join"
            className="btn-press inline-flex items-center justify-center bg-[#E8843A] hover:bg-[#d9752c] text-white text-xs font-bold rounded-full px-5 py-2.5 shadow-2xs transition-all"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Join the Pack
          </Link>
        </div>
      </div>
    </header>
  )
}
