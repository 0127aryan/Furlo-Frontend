'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { unregisterWebPushToken } from '@/lib/webPushNotifications'
import { CommunityDisclaimerFooter } from '@/components/feed/CommunityDisclaimerFooter'
import { resetAnalyticsUser } from '@/lib/posthog'

const LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export function ProfileMenuSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()
  const [loggingOut, setLoggingOut] = useState(false)
  const showOps = Boolean(
    user?.is_admin === true || user?.role === 'super_admin' || user?.role === 'admin'
  )

  if (!open) return null

  const go = (href: string) => {
    onClose()
    router.push(href)
  }

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    onClose()
    clearAuth()
    resetAnalyticsUser()
    try {
      await unregisterWebPushToken()
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch {
      // Session clear still sends the user to sign-in.
    } finally {
      router.push('/join?mode=signin')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(1,30,20,0.35)]" onClick={onClose}>
      <aside
        className="h-full w-[82%] max-w-[320px] bg-[#FEF9F3] border-l border-[#EDE8E1] px-5 pt-6 pb-6 flex flex-col"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[22px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-[#887366]"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {showOps && (
            <button
              type="button"
              onClick={() => go('/admin')}
              className="flex items-center justify-between min-h-11 px-1 rounded-xl hover:bg-[#F8F3ED] text-left"
            >
              <span className="flex items-center gap-2 text-[16px] font-semibold text-[#163328]">
                <span className="material-symbols-outlined text-[18px] text-[#E8843A]">verified_user</span>
                Furlo Ops
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#887366]">chevron_right</span>
            </button>
          )}
          {LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => go(link.href)}
              className="flex items-center justify-between min-h-11 px-1 rounded-xl hover:bg-[#F8F3ED] text-left"
            >
              <span className="text-[16px] font-semibold text-[#163328]">{link.label}</span>
              <span className="material-symbols-outlined text-[18px] text-[#887366]">chevron_right</span>
            </button>
          ))}
          {user && (
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="flex items-center min-h-11 px-1 rounded-xl hover:bg-[#FFF5F5] text-left disabled:opacity-60"
            >
              <span className="flex items-center gap-2 text-[16px] font-semibold text-[#BA1A1A]">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {loggingOut ? 'Signing out…' : 'Log Out'}
              </span>
            </button>
          )}
        </div>

        <div className="mt-auto pt-4">
          <CommunityDisclaimerFooter compact />
          <p className="mt-3 text-[11px] font-medium text-[#727974]">© 2026 Furlo Inc.</p>
        </div>
      </aside>
    </div>
  )
}
