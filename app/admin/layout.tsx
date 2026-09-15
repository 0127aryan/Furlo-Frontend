'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { subscribeModerationQueue } from '@/lib/subscribeModerationQueue'

interface AdminStatsSummary {
  pendingApprovals: number
  openReports: number
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()

  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [stats, setStats] = useState<AdminStatsSummary>({ pendingApprovals: 0, openReports: 0 })

  const refreshStats = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        apiFetch<{ stats: { pendingApprovals: number; openReports: number } }>('/admin/stats').catch(() => null),
        apiFetch<{ reports: Array<{ status: string }> }>('/admin/reports').catch(() => null),
      ])

      const openFromReports = reportsRes?.reports
        ? reportsRes.reports.filter((r) => r.status === 'open').length
        : undefined

      const openReports = openFromReports !== undefined
        ? openFromReports
        : (statsRes?.stats?.openReports || 0)

      const pendingApprovals = statsRes?.stats?.pendingApprovals || 0

      setStats({ pendingApprovals, openReports })
    } catch (err) {
      console.error('[AdminLayout] Failed to refresh stats:', err)
    }
  }

  useEffect(() => {
    // Check admin authorization & fetch badge counts
    refreshStats().then(() => {
      setAuthorized(true)
    }).catch(() => {
      if (user?.is_admin || (user as any)?.role === 'super_admin') {
        setAuthorized(true)
      } else {
        setAuthorized(false)
      }
    })
  }, [user])

  useEffect(() => {
    // Real-time listener to keep sidebar Moderation Queue badge count updated live
    const unsub = subscribeModerationQueue(() => {
      refreshStats()
    })
    return () => unsub()
  }, [])

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#011E14] text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[40px] text-[#E8843A] animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-bold tracking-widest uppercase text-[#A3B8B0]">
            Verifying Admin Privileges...
          </p>
        </div>
      </div>
    )
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE8E1] text-center max-w-md w-full shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">gavel</span>
          </div>
          <h2
            className="text-[22px] font-bold text-[#011E14]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Access Denied
          </h2>
          <p className="text-xs text-[#727974] leading-relaxed">
            Super Admin privileges are required to access the operations portal. Please log in with an authorized administrator account.
          </p>
          <div className="pt-2">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E8843A] hover:bg-[#974900] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Pack Feed</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const navItems = [
    {
      id: 'overview',
      href: '/admin',
      label: 'Overview & Metrics',
      icon: 'dashboard',
      exact: true,
    },
    {
      id: 'approvals',
      href: '/admin/communities',
      label: 'Community Approvals',
      icon: 'groups',
      badge: stats.pendingApprovals,
    },
    {
      id: 'pets',
      href: '/admin/pets',
      label: 'Pet Directory & Badges',
      icon: 'pets',
    },
    {
      id: 'moderation',
      href: '/admin/moderation',
      label: 'Moderation Queue',
      icon: 'shield',
      badge: stats.openReports,
      badgeColor: 'bg-[#DC2626]',
    },
    {
      id: 'banners',
      href: '/admin/banners',
      label: 'Announcement Banners',
      icon: 'campaign',
    },
    {
      id: 'broadcast',
      href: '/admin/broadcast',
      label: 'Platform Broadcast',
      icon: 'send',
    },
  ]

  return (
    <div
      className="min-h-screen flex bg-[#FAF7F2]"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Admin Left Sidebar */}
      <aside className="w-[280px] bg-[#011E14] text-white flex flex-col shrink-0 border-r border-[#163328] min-h-screen sticky top-0 h-screen">
        {/* Logo & Header */}
        <div className="p-6 border-b border-[#163328] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8843A] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </div>
            <div>
              <span
                className="text-[18px] font-bold text-white tracking-tight block leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Furlo Ops
              </span>
              <span className="text-[10px] uppercase font-bold text-[#476457] tracking-widest">
                Super Admin
              </span>
            </div>
          </div>

          <Link
            href="/feed"
            title="Return to App"
            className="w-8 h-8 rounded-lg bg-[#163328] hover:bg-[#23473A] text-[#A3B8B0] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-none">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#476457]">
            Operations Navigation
          </div>

          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1B4D3E] text-white shadow-2xs'
                    : 'text-[#A3B8B0] hover:bg-[#163328] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-colors ${
                      isActive ? 'text-[#E8843A]' : 'text-[#476457] group-hover:text-[#A3B8B0]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {Boolean(item.badge && item.badge > 0) && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white animate-pulse ${
                      item.badgeColor || 'bg-[#E8843A]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Admin Chip */}
        <div className="p-4 border-t border-[#163328] bg-[#0A261B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1B4D3E] border border-[#23473A] flex items-center justify-center text-white font-bold text-xs uppercase">
              {user?.name?.[0] || user?.email?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {user?.name || 'Super Admin'}
              </p>
              <p className="text-[10px] text-[#A3B8B0] truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#EDE8E1] px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#727974]">
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <span>Super Admin Operations Center</span>
            <span className="text-[#C1C8C3]">/</span>
            <span className="text-[#011E14] capitalize">
              {pathname === '/admin' ? 'Overview' : pathname.split('/admin/')[1]?.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F5EB] border border-[#BBF7D0] text-[#166534] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#16803D] animate-pulse"></span>
              <span>Live System Online</span>
            </div>
          </div>
        </header>

        {/* Children Pages */}
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
