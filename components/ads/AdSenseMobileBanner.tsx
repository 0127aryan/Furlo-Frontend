'use client'

import { usePathname } from 'next/navigation'
import { AdSenseUnit } from '@/components/ads/AdSenseUnit'
import { showsMobileTabBar } from '@/lib/mobileNav'
import { useAuthStore } from '@/store/useAuthStore'

export function AdSenseMobileBanner() {
  const pathname = usePathname() || ''
  const activePet = useAuthStore((s) => s.activePet)
  const user = useAuthStore((s) => s.user)
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER
  const aboveTabBar = showsMobileTabBar(pathname, activePet, user?.id)

  if (!slot) return null

  return (
    <div
      className={`lg:hidden fixed inset-x-0 z-30 bg-[#fef9f3] ${
        aboveTabBar ? 'bottom-[calc(52px+env(safe-area-inset-bottom))]' : 'bottom-0'
      }`}
    >
      <AdSenseUnit slot={slot} format="horizontal" />
    </div>
  )
}
