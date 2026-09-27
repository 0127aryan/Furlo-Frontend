'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { ProfileMenuSheet } from '@/components/nav/ProfileMenuSheet'
import { useAuthStore } from '@/store/useAuthStore'

export default function OwnProfileFallbackPage() {
  const activePet = useAuthStore((s) => s.activePet)
  const [menuOpen, setMenuOpen] = useState(false)
  const href = activePet?.username
    ? `/pet/${activePet.username}`
    : activePet?.id
      ? `/pet/${activePet.id}`
      : ''

  if (href) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEF9F3] px-6">
        <Link href={href} className="text-[#E8843A] font-bold">
          Open My Paw Print
        </Link>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#FEF9F3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <AppSidebar />
      <main className="flex-1 max-w-[800px] mx-auto w-full pb-24">
        <header className="flex md:hidden items-center justify-between px-2 py-1 border-b border-[#EDE8E1]">
          <div className="flex items-center gap-1">
            <Link href="/feed" className="w-11 h-11 flex items-center justify-center text-[#011E14]">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <span className="text-[20px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              My Paw Print
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-[#011E14]"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
        <div className="flex flex-col items-center justify-center text-center gap-2 px-6 py-24">
          <h1 className="text-[20px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            No Paw Print yet
          </h1>
          <p className="text-[14px] text-[#554338] max-w-sm">
            Finish onboarding to see your profile here.
          </p>
        </div>
      </main>
      <ProfileMenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
