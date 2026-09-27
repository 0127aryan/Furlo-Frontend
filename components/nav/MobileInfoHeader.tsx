'use client'

import { useRouter } from 'next/navigation'

export function MobileInfoHeader({ title }: { title: string }) {
  const router = useRouter()

  return (
    <header className="md:hidden px-4 pt-3 pb-3 border-b border-[#EDE8E1] bg-[#FEF9F3]">
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) router.back()
          else router.push('/feed')
        }}
        className="w-11 h-11 -ml-2 flex items-center justify-center text-[#011E14]"
        aria-label="Go back"
      >
        <span className="material-symbols-outlined text-[22px]">arrow_back</span>
      </button>
      <h1
        className="text-[24px] font-bold text-[#163328] mt-1"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {title}
      </h1>
    </header>
  )
}
